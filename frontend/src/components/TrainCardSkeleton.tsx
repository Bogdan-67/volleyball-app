import React from 'react';
import ContentLoader from 'react-content-loader';

const TrainCardSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={'100%'}
    height={200}
    viewBox='0 0 100% 200'
    backgroundColor='#dbf0ff'
    foregroundColor='#c4e6fc'
    {...props}>
    <rect x='0' y='0' rx='20' ry='20' width='100%' height='200' />
  </ContentLoader>
);

export default TrainCardSkeleton;
