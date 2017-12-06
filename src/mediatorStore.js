import MediatorStore from './mediators/MediatorStore';
import Scene from './models/Scene';
import SceneMediator from './mediators/Scene';
import Commit from './models/Commit';
import CommitMediator from './mediators/Commit';
import File from './models/File';
import FileMediator from './mediators/File';

const mediatorStore = new MediatorStore();

mediatorStore.register(Scene, SceneMediator);
mediatorStore.register(Commit, CommitMediator);
mediatorStore.register(File, FileMediator);

export default mediatorStore;
