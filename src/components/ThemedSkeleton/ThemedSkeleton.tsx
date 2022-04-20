import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { v4 as uuidv4 } from 'uuid';


const ThemedSkeleton = () => {
  const { uiState: { theme }, } = useSelector(({ uiState, }: RootState) => ({
    uiState: {
      theme  : uiState.theme,
    },
  })
);
  return theme === "dark"
    ? <SkeletonTheme color="#343a40" highlightColor="#888" key={uuidv4()}>
        <Skeleton count={1}/>
      </SkeletonTheme>
    : <Skeleton count={1} key={uuidv4()}/>
}
export default ThemedSkeleton