import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { breakpoints, useWindowSize } from '@edx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import SidebarTriggers from '../courseware/course/sidebar/SidebarTriggers';
import Tabs from '../generic/tabs/Tabs';
import messages from './messages';

const CourseTabsNavigation = ({
  activeTabSlug, className, tabs, intl, showSidebarTriggers,
}) => {
  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    return null;
  }

  const shouldDisplayTriggers = windowWidth >= breakpoints.small.minWidth;

  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation d-flex', className)}>
      <div className="container-xl">
        <Tabs
          className="nav-underline-tabs"
          aria-label={intl.formatMessage(messages.courseMaterial)}
        >
          {tabs.map(({ url, title, slug }) => (
            <a
              key={slug}
              className={classNames('nav-item flex-shrink-0 nav-link py-0 d-flex align-items-center small', { active: slug === activeTabSlug })}
              href={url}
            >
              {title}
            </a>
          ))}
        </Tabs>
      </div>
      {shouldDisplayTriggers && showSidebarTriggers && (
        <SidebarTriggers />
      )}
    </div>
  );
};

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  intl: intlShape.isRequired,
  showSidebarTriggers: PropTypes.bool.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
