import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import { getConfig } from '@edx/frontend-platform';
import {
  Button,
  Layout,
  Scrollable,
  breakpoints,
  useToggle,
  useWindowSize,
} from '@edx/paragon';

import useEnrollmentAlert from '../alerts/enrollment-alert';
import useLogistrationAlert from '../alerts/logistration-alert';
import { CourseTabsNavigation } from '../course-tabs';
import { useModel } from '../generic/model-store';
import { AlertList } from '../generic/user-messages';
import InstructorToolbar from '../instructor-toolbar';
import StreakModal from '../shared/streak-celebration';

import SectionSidebar from '../course-home/outline-tab/SectionSidebar';
import ProductTours from '../product-tours/ProductTours';

const LoadedTabPage = ({
  activeTabSlug,
  children,
  courseId,
  metadataModel,
  unitId,
  sequenceId,
}) => {
  const {
    celebrations,
    org,
    originalUserIsStaff,
    tabs,
    title,
    verifiedMode,
  } = useModel('courseHomeMeta', courseId);

  const [expandAll, setExpandAll] = useState(false);

  const {
    courseBlocks: {
      courses,
      sections,
    } = {},
  } = useModel('outline', courseId);

  // Logistration and enrollment alerts are only really used for the outline tab, but loaded here to put them above
  // breadcrumbs when they are visible.
  const logistrationAlert = useLogistrationAlert(courseId);
  const enrollmentAlert = useEnrollmentAlert(courseId);

  const activeTab = tabs.filter(tab => tab.slug === activeTabSlug)[0];

  const streakLengthToCelebrate = celebrations && celebrations.streakLengthToCelebrate;
  const streakDiscountCouponEnabled = celebrations && celebrations.streakDiscountEnabled && verifiedMode;
  const [isStreakCelebrationOpen, , closeStreakCelebration] = useToggle(streakLengthToCelebrate);
  const rootCourseId = courses && Object.keys(courses)[0];
  const wideScreen = useWindowSize().width >= breakpoints.medium.minWidth;

  if (activeTabSlug === 'courseware' && wideScreen) {
    return (
      <div
        style={{
          bottom: '0',
          top: '3.3em',
          left: '0',
          right: '0',
          position: 'fixed',
          overflowX: 'hidden',
        }}
      >
        <Layout
          md={[{ span: 3, offset: 0 }, { span: 9, offset: 0 }]}
          className="px-0"
        >
          <Layout.Element
            className="bg-white border-right"
            style={{
              zIndex: 4,
              minHeight: '100vh',
            }}
          >
            {rootCourseId && (
              <Scrollable
                style={{
                  bottom: '0',
                  top: '3.3em',
                  position: 'fixed',
                  width: '24.2vw',
                  overflowX: 'hidden',
                }}
                className="px-4"
              >
                <Button
                  className="my-3"
                  variant="light"
                  size="sm"
                  block
                  onClick={() => { setExpandAll(!expandAll); }}
                >
                  {expandAll ? 'Collapse All' : 'Expand All'}
                </Button>
                <ol id="courseHome-outline" className="list-unstyled">
                  {courses[rootCourseId].sectionIds.map((sectionId) => (
                    <SectionSidebar
                      currentSequence={sequenceId}
                      key={sectionId}
                      courseId={courseId}
                      defaultOpen={sections[sectionId].resumeBlock}
                      expand={expandAll}
                      section={sections[sectionId]}
                    />
                  ))}
                </ol>
              </Scrollable>
            )}
          </Layout.Element>
          <Layout.Element className="pl-0">
            <ProductTours
              activeTab={activeTabSlug}
              courseId={courseId}
              isStreakCelebrationOpen={isStreakCelebrationOpen}
              org={org}
            />
            <Helmet>
              <title>{`${activeTab ? `${activeTab.title} | ` : ''}${title} | ${getConfig().SITE_NAME}`}</title>
            </Helmet>
            <StreakModal
              courseId={courseId}
              metadataModel={metadataModel}
              streakLengthToCelebrate={streakLengthToCelebrate}
              isStreakCelebrationOpen={!!isStreakCelebrationOpen}
              closeStreakCelebration={closeStreakCelebration}
              streakDiscountCouponEnabled={streakDiscountCouponEnabled}
              verifiedMode={verifiedMode}
            />
            <main id="main-content" className="d-flex flex-column flex-grow-1">
              <AlertList
                topic="outline"
                className="mx-5 mt-3"
                customAlerts={{
                  ...enrollmentAlert,
                  ...logistrationAlert,
                }}
              />
              <CourseTabsNavigation tabs={tabs} activeTabSlug="outline" showSidebarTriggers />
              {originalUserIsStaff && (
                <InstructorToolbar
                  courseId={courseId}
                  unitId={unitId}
                  tab={activeTabSlug}
                />
              )}
              <div>
                {children}
              </div>
            </main>
          </Layout.Element>
        </Layout>
      </div>
    );
  }

  return (
    <div>
      <ProductTours
        activeTab={activeTabSlug}
        courseId={courseId}
        isStreakCelebrationOpen={isStreakCelebrationOpen}
        org={org}
      />
      <Helmet>
        <title>{`${activeTab ? `${activeTab.title} | ` : ''}${title} | ${getConfig().SITE_NAME}`}</title>
      </Helmet>
      {originalUserIsStaff && wideScreen && (
        <InstructorToolbar
          courseId={courseId}
          unitId={unitId}
          tab={activeTabSlug}
        />
      )}
      <StreakModal
        courseId={courseId}
        metadataModel={metadataModel}
        streakLengthToCelebrate={streakLengthToCelebrate}
        isStreakCelebrationOpen={!!isStreakCelebrationOpen}
        closeStreakCelebration={closeStreakCelebration}
        streakDiscountCouponEnabled={streakDiscountCouponEnabled}
        verifiedMode={verifiedMode}
      />
      <main id="main-content" className="d-flex flex-column flex-grow-1">
        <AlertList
          topic="outline"
          className="mx-5 mt-3"
          customAlerts={{
            ...enrollmentAlert,
            ...logistrationAlert,
          }}
        />
        <CourseTabsNavigation tabs={tabs} className={(metadataModel === 'courseHomeMeta' || wideScreen) && 'mb-3'} activeTabSlug={activeTabSlug} />
        <div className="container-xl">
          {children}
        </div>
      </main>
    </div>
  );
};

LoadedTabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string,
  metadataModel: PropTypes.string,
  unitId: PropTypes.string,
};

LoadedTabPage.defaultProps = {
  children: null,
  metadataModel: 'courseHomeMeta',
  unitId: null,
  sequenceId: null,
};

export default LoadedTabPage;
