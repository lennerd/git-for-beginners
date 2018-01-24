import { action, everyFrame } from 'popmotion';

export const loop = (...actions) =>
  action(({ update, complete }) => {
    let i = 0;
    let current;

    const playCurrent = () => {
      current = actions[i].start({
        complete: () => {
          i++;

          if (i >= actions.length) {
            i = 0;
          }

          playCurrent();
        },
        update,
      });
    };

    playCurrent();

    return {
      stop: () => current != null && current.stop(),
    };
  });

export const actionQueue = () =>
  action(({ update, complete }) => {
    let i = 0;
    const queue = [];
    let current;
    let playing = false;

    const playCurrent = () => {
      if (playing || queue.length === 0) {
        return;
      }

      playing = true;
      current = queue[i].start({
        complete: () => {
          i++;
          playing = false;

          if (i >= queue.length) {
            complete();
          } else {
            playCurrent();
          }
        },
        update,
      });
    };

    playCurrent();

    return {
      add: (...actions) => {
        queue.push(...actions);

        playCurrent();
      },
      stop: () => {
        if (current != null) {
          current.stop();
        }
      },
    };
  });

export const delay = timeToDelay =>
  action(({ complete }) => {
    const frame = everyFrame().start({
      update(timeSinceStart) {
        if (timeSinceStart >= timeToDelay) {
          complete();
          frame.stop();
        }
      },
    });

    return frame;
  });
