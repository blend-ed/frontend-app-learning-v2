import { LearningHeader as Header } from '@edx/frontend-component-header';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  breakpoints,
  useWindowSize,
  Toast,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import PageLoading from '../generic/PageLoading';
import { useModel } from '../generic/model-store';
import { getAccessDeniedRedirectUrl } from '../shared/access';

import { setCallToActionToast } from '../course-home/data/slice';
import genericMessages from '../generic/messages';
import LaunchCourseHomeTourButton from '../product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';
import LoadedTabPage from './LoadedTabPage';
import messages from './messages';

const TabPage = ({ intl, ...props }) => {
  const {
    activeTabSlug,
    courseId,
    courseStatus,
    metadataModel,
  } = props;
  const {
    toastBodyLink,
    toastBodyText,
    toastHeader,
  } = useSelector(state => state.courseHome);
  const dispatch = useDispatch();
  const {
    courseAccess,
    number,
    org,
    start,
    title,
  } = useModel('courseHomeMeta', courseId);

  const wideScreen = useWindowSize().width >= breakpoints.medium.minWidth;

  if (courseStatus === 'loading') {
    return (
      <>
        <Header />
        <PageLoading
          srMessage={intl.formatMessage(messages.loading)}
        />
      </>
    );
  }

  if (courseStatus === 'denied') {
    const redirectUrl = getAccessDeniedRedirectUrl(courseId, activeTabSlug, courseAccess, start);
    if (redirectUrl) {
      return (<Redirect to={redirectUrl} />);
    }
  }

  // Either a success state or a denied state that wasn't redirected above (some tabs handle denied states themselves,
  // like the outline tab handling unenrolled learners)
  if (courseStatus === 'loaded' || courseStatus === 'denied') {
    return (
      <>
        <Toast
          action={toastBodyText ? {
            label: toastBodyText,
            href: toastBodyLink,
          } : null}
          closeLabel={intl.formatMessage(genericMessages.close)}
          onClose={() => dispatch(setCallToActionToast({ header: '', link: null, link_text: null }))}
          show={!!(toastHeader)}
        >
          {toastHeader}
        </Toast>
        {metadataModel === 'courseHomeMeta' && (<LaunchCourseHomeTourButton srOnly />)}
        {wideScreen ? (
          <div
            className="position-fixed w-100"
            style={{ zIndex: 1000 }}
          >
            <Header
              courseOrg={org}
              courseNumber={number}
              courseTitle={title}
            />
          </div>
        ) : (
          <Header
            courseOrg={org}
            courseNumber={number}
            courseTitle={title}
          />
        )}
        <LoadedTabPage {...props} />
      </>
    );
  }

  // courseStatus 'failed' and any other unexpected course status.
  return (
    <>
      <Header />
      <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
        {intl.formatMessage(messages.failure)}
      </p>
    </>
  );
};

TabPage.defaultProps = {
  courseId: null,
  unitId: null,
};

TabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string,
  sequenceId: PropTypes.string.isRequired,
  courseStatus: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

export default injectIntl(TabPage);
