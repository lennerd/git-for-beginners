import { serializable, list, object, primitive } from "serializr";
import { observable } from "mobx";
import ChapterState from "./ChapterState";

class TutorialState {
  @serializable(list(object(ChapterState))) chapterStates = [];
  @serializable(primitive()) @observable currentChapterId;
}

export default TutorialState;
