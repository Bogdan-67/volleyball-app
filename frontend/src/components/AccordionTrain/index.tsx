import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPlaceholder } from './Placeholder';
import './accordion.scss';
import { ITrain } from '../../models/ITrain';

const AccordionItem = ({
  data,
  expanded,
  setExpanded,
  onClickAddAction,
  buttonEnabled,
  onClickDelete,
}) => {
  const isOpen = data === expanded;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ backgroundColor: isOpen ? '#481fff' : '#4a96ff' }}
        className='accordion-header'
        onClick={() => setExpanded(isOpen ? false : data)}>
        {data.fio}
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            className='accordion-section'
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}>
            <ContentPlaceholder
              data={data}
              buttonEnabled={buttonEnabled}
              onClickDelete={onClickDelete}
              onClickAddAction={onClickAddAction}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export const Accordion = (props) => {
  // This approach is if you only want max one section open at a time. If you want multiple
  // sections to potentially be open simultaneously, they can all be given their own `useState`.
  const [expanded, setExpanded] = useState<false | number>(0);

  return (
    <div className='accordion'>
      {props.playersStats.map((item: ITrain) => (
        <AccordionItem
          onClickDelete={props.onClickDelete}
          data={item}
          buttonEnabled={props.buttonEnabled}
          expanded={expanded}
          setExpanded={setExpanded}
          onClickAddAction={props.onClickAddAction}
        />
      ))}
    </div>
  );
};

const accordionIds = [0, 1, 2, 3];

export default Accordion;
