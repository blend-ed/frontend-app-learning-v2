import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Card } from '@edx/paragon';

import DateSummary from '../DateSummary';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const CourseDates = ({
  intl,
}) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const {
    userTimezone,
  } = useModel('courseHomeMeta', courseId);
  const {
    datesWidget: {
      courseDateBlocks,
      datesTabLink,
    },
  } = useModel('outline', courseId);

  if (courseDateBlocks.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 rounded py-3 px-4 raised-card">
      <div id="courseHome-dates">
        <h2 className="h4">{intl.formatMessage(messages.dates)}</h2>
        <ol className="list-unstyled">
          {courseDateBlocks.map((courseDateBlock) => (
            <DateSummary
              key={courseDateBlock.title + courseDateBlock.date}
              dateBlock={courseDateBlock}
              userTimezone={userTimezone}
            />
          ))}
        </ol>
        <a className="font-weight-bold ml-4 pl-1 small" href={datesTabLink}>
          {intl.formatMessage(messages.allDates)}
        </a>
      </div>
    </Card>
  );
};

CourseDates.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseDates);
