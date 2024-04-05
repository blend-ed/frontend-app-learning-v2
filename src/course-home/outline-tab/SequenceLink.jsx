import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import EffortEstimate from '../../shared/effort-estimate';
import messages from './messages';

const SequenceLink = ({
  id,
  intl,
  courseId,
  first,
  sequence,
  currentSequence,
}) => {
  const {
    complete,
    showLink,
    title,
  } = sequence;

  const coursewareUrl = <Link to={`/course/${courseId}/${id}`} className={sequence.id === currentSequence ? 'text-wrap font-weight-bold text-white' : 'text-dark'}>{title}</Link>;
  const displayTitle = showLink ? coursewareUrl : title;

  return (
    <li>
      <div className={classNames('pb-2', { 'mt-2 pt-2': !first, 'bg-primary py-3': sequence.id === currentSequence })} style={{ borderRadius: '4rem' }}>
        <div className="row w-100 m-0 px-4 x-small">
          <div className="col-auto p-0">
            {complete ? (
              <FontAwesomeIcon
                icon={fasCheckCircle}
                fixedWidth
                className="float-left text-success mt-1"
                aria-hidden="true"
                title={intl.formatMessage(messages.completedAssignment)}
              />
            ) : (
              <FontAwesomeIcon
                icon={farCheckCircle}
                fixedWidth
                className="float-left text-gray-400 mt-1"
                aria-hidden="true"
                title={intl.formatMessage(messages.incompleteAssignment)}
              />
            )}
          </div>
          <div className="col-10 p-0 ml-3">
            <span>{displayTitle}</span>
            <span className="sr-only">
              , {intl.formatMessage(complete ? messages.completedAssignment : messages.incompleteAssignment)}
            </span>
            <EffortEstimate className="ml-2" block={sequence} />
          </div>
        </div>
      </div>
    </li>
  );
};

SequenceLink.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  sequence: PropTypes.shape().isRequired,
  currentSequence: PropTypes.string,
};

SequenceLink.defaultProps = {
  currentSequence: null,
};

export default injectIntl(SequenceLink);
