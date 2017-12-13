import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Provider, observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { runInAction } from 'mobx';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import ChapterWrapper from './ChapterWrapper';
import ChapterText from './ChapterText';

@inject('tutorial')
@observer
class Chapter extends Component {
  static defaultProps = {
    storyInitialiser: Story => new Story.default(),
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
      <Provider chapter={chapter} story={this.story}>
        <ChapterWrapper {...props}>
          {this.renderRedirect()}
          <Helmet>
            <title>{chapter.title}</title>
          </Helmet>
          <TransitionGroup>
            <ChapterText key={this.story.nextAction.name} half={this.story.options.half}>
              {this.story.write({ chapter, ...props })}
            </ChapterText>
          </TransitionGroup>
          {this.story.visualise({ chapter, ...props })}
        </ChapterWrapper>
      </Provider>
    );
  }
}

export default Chapter;
