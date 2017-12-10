import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import Container from '../common/Container';
import NavigationItem from './NavigationItem';

const NavigationContent = styled.div`
  position: relative;
  height: ${props => props.theme.spacing(2.75)};
  display: flex;
  justify-content: stretch;
  align-items: stretch;

  &:after,
  &:before {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    background-color: white;
  }

  &:after {
    left: 99%;
    right: calc((100vw - 100%) / -2);
  }

  &:before {
    right: 99%;
    left: calc((100vw - 100%) / -2);
  }

  ${NavigationItem} {
    width: 100%;
  }
`;

const NavigationTimeline = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => 100 / props.items / 2}%;
  right: ${props => 100 / props.items / 2}%;
  height: 1px;
  background-color: #F2F2F2;
  pointer-events: none;

  &:after {
    transition: 1s width;
    will-change: width;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => 100 * props.progress}%;
    height: 100%;
    background-color: ${props => props.theme.color.highlight};
  }
`;

@inject('tutorial')
@observer
class Navigation extends Component {
  render() {
    const { className, tutorial } = this.props;
    const { chapters, totalProgress } = tutorial;

    const navigationItems = chapters.map(chapter => (
      <NavigationItem
        key={chapter.id}
        to={`/chapter/${chapter.id}`}
        done={chapter.done}
      >
          {chapter.title}
      </NavigationItem>
    ));

    return (
      <div className={className}>
        <Container>
          <NavigationContent>
            {navigationItems}
            <NavigationTimeline items={chapters.length} progress={totalProgress} />
          </NavigationContent>
        </Container>
      </div>
    );
  }
}

export default styled(Navigation)``;
