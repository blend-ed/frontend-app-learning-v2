import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useWindowSize } from '@edx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Tabs from '../generic/tabs/Tabs';
import messages from './messages';

const CourseTabsNavigation = ({
  activeTabSlug, className, tabs, intl,
}) => {
  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    return null;
  }

  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation d-flex', className)}>
      <div className="container-xl">
        <Tabs
          className="nav-underline-tabs"
          aria-label={intl.formatMessage(messages.courseMaterial)}
        >
          {tabs
            .filter(({ slug }) => slug !== 'dates')
            .map(({ url, title, slug }) => (
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
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
