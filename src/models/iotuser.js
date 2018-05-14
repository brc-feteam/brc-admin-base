import key from 'keymaster';

const debug = require('debug')('brc-models[iotuser]');

export default {
    namespace: 'iotuser',
    state: {
        message: '',
    },
    effects: {
        *handleSaveMessage(_, { call, put }) {
            yield debug(`test debug`, call, put);
            yield put({
                type: 'saveMessage',
                payload: 'save message ok',
            })
        },
    },
    reducers: {
        saveMessage(state, action) {
            return {
                ...state,
                message: action.payload,
            }
        },
    },
    subscriptions: {
        keyboardWatcher({ dispatch }) {
            key('⌘+up, ctrl+up', () => {
                dispatch({ type: 'handleSaveMessage' });
            });
        },
    },
}

