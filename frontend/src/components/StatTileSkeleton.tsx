import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

const StatTileSkeleton = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [skeletonWidth, setSkeletonWidth] = useState<number | string>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Добавляем обработчик события изменения размера окна
    window.addEventListener('resize', handleResize);

    // Удаляем обработчик события при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth) {
      if (windowWidth > 1300) setSkeletonWidth(windowWidth / 5.75);
      else if (windowWidth > 760) setSkeletonWidth('48%');
      else setSkeletonWidth('47%');
    }
  }, [windowWidth]);

  return (
    <ContentLoader
      speed={2}
      width={skeletonWidth}
      height={100}
      viewBox={`0 0 ${skeletonWidth} 100`}
      backgroundColor='#dbf0ff'
      foregroundColor='#c4e6fc'
      {...props}>
      <rect x='0' y='0' rx='20' ry='20' width={skeletonWidth} height='100' />
    </ContentLoader>
  );
};

export default StatTileSkeleton;
