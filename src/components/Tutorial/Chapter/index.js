import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Provider, observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { runInAction } from 'mobx';

import ChapterWrapper from './ChapterWrapper';

@inject('tutorial')
@observer
class Chapter extends Component {
  static defaultProps = {
    storyInitialiser: Story => new Story.default(),
  };

  constructor(props) {
    super();

    const { storyInitialiser, loaded, chapter } = props;

    runInAction(() => {
      chapter.storyInitialiser = storyInitialiser;
      chapter.loaded = loaded;
    });
  }

  renderRedirect() {
    const { tutorial, chapter } = this.props;

    if (!chapter.story.nextChapter) {
      return null;
    }

    const { currentChapter } = tutorial;
    const { nextChapter } = chapter;

    if (nextChapter == null || nextChapter === currentChapter) {
      return null;
    }

    return <Redirect to={`/chapter/${nextChapter.index}`} />;
  }

  render() {
    const { chapter, ...props } = this.props;

    delete props.storyInitialiser;
    delete props.loaded;
    delete props.tutorial;

    return (
      <Provider chapter={chapter}>
        <ChapterWrapper {...props}>
          {this.renderRedirect()}
          <Helmet>
            <title>{chapter.title}</title>
          </Helmet>
          {chapter.story.write({ chapter, ...props })}
          {chapter.story.visualise({ chapter, ...props })}
        </ChapterWrapper>
      </Provider>
    );
  }
}

export default Chapter;
