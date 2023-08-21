import React from 'react';
import ContentLoader from 'react-content-loader';

const DataSkeleton = ({ width, height }) => (
  <ContentLoader
    speed={2}
    width={width}
    height={height}
    viewBox={'0 0 ' + width + ' ' + height}
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'>
    <rect x='0' y='0' rx='15' ry='15' width={width} height={height} />
  </ContentLoader>
);

export default DataSkeleton;
