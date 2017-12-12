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
    storyInitialiser: Story => new Story(),
  };

  constructor(props) {
    super();

    const { storyInitialiser, loaded, chapter } = props;

    this.story = storyInitialiser(loaded);

    runInAction(() => {
      chapter.story = this.story;
    });
  }

  renderRedirect() {
    const { tutorial, chapter } = this.props;

    if (!this.story.nextChapter) {
      return null;
    }

    const { currentChapter } = tutorial;
    const { nextChapter } = chapter;

    if (nextChapter == null || nextChapter === currentChapter) {
      return null;
    }

    return <Redirect to={`/chapter/${nextChapter.id}`} />;
  }

  render() {
    const { chapter, ...props } = this.props;

    delete props.storyInitialiser;
    delete props.loaded;

    return (
      <Provider chapter={chapter} story={this.story}>
        <ChapterWrapper {...props}>
          {this.renderRedirect()}
          <Helmet>
            <title>{chapter.title}</title>
          </Helmet>
          {this.story.write({ chapter, ...props })}
          {this.story.visualise({ chapter, ...props })}
        </ChapterWrapper>
      </Provider>
    );
  }
}

export default Chapter;
