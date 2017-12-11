import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'mobx-react';

import ChapterWrapper from './ChapterWrapper';
import ChapterText from './ChapterText';
import ChapterButton from './ChapterButton';

class Chapter extends PureComponent {
  componentDidMount() {
    const { chapter } = this.props;

    chapter.reset();
  }

  render() {
    const { chapter, children, ...props } = this.props;

    return (
      <Provider chapter={chapter}>
        <ChapterWrapper {...props}>
          <Helmet>
            <title>{chapter.title}</title>
          </Helmet>
          {children}
        </ChapterWrapper>
      </Provider>
    );
  }
}

export default Chapter;

export {
  ChapterText,
  ChapterButton,
}
