import React, {FC} from 'react';
import CustomView from '../../components/global/CustomView';
import CustomGradient from '../../components/global/CustomGradient';
import GlobalFeed from '../../components/feed/GlobalFeed';

const HomeScreen: FC = () => {
  return (
    <CustomView>
      <CustomGradient position="top" />
      <GlobalFeed />
      <CustomGradient position="bottom" />
    </CustomView>
  );
};

export default HomeScreen;
