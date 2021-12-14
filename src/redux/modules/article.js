import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import api from '../../shared/api';
import axios from "axios";
import { initial } from "lodash";

// action
const GET_ARTICLE = 'GET_ARTICLE';
const ADD_ARTICLE = 'ADD_ARTICLE';
const EDIT_ARTICLE = 'EDIT_ARTICLE';
const DELETE_ARTICLE = "DELETE_ARTICLE";
const LOADING = 'LOADING';

// action creators
const getArticle = createAction(GET_ARTICLE, (list) => ({list}));
const addArticle = createAction(ADD_ARTICLE, (article) => ({article}));
const editArticle = createAction(EDIT_ARTICLE, (id, article) => ({id, article}));
const deleteArticle = createAction(DELETE_ARTICLE, (id) => ({id}));
const loading = createAction(LOADING, (state) => ({state}));

// initailState
const initialState = {
  list: [],
  is_loading: false,
};

const initialArticle = {
  // id: 1,
  // loginId: '',
  nickname: '',
  content: '',
  image: ''
}

// middlewares
const getArticleDB = () => {
  return async function(dispatch, getState, {history}) {
    dispatch(loading(true))

    await api.get("/api/article")
    .then(res => {
      console.log(res);
      dispatch(getArticle(res));
    }).catch(err => {
      console.log('게시물 조회 오류', err)
    })

  }
}

const addArticleDB = (content, image) => {
  return async function(dispatch, getState, {history}) {
    const form = new FormData();
    form.append('img', image);
    form.append('content', content);

    // console.log(content, image) 확인완료
    // axios 요청
    await api.post("/api/article", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
      console.log(res.data);
      dispatch(addArticle(res.data));
      // history.replace('/home');
    }).catch(err => {
      console.log("게시물 등록 오류", err)
    })

  }
}

const editArticleDB = (id, content, image) => {
  return async function(dispatch, getState, {history}) {
    const form = new FormData();
    form.append('image', image);
    form.append('content', content);

    // console.log(content, image) 확인완료
    // axios 요청
    await api.put(`/api/article/${id}`,form, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(res => {
      console.log(res.data);
      dispatch(editArticle(res.data));
      // history.replace('/home');
    }).catch(err => {
      console.log("게시물 수정 오류", err)
    })

  }
}

const deleteArticleDB = (id) => {
  return async function(dispatch, getState, {history}) {
    // console.log(id) 확인완료
    // axios 요청
    await api.delete(`/api/article/${id}`)
    .then(() => {
      dispatch(deleteArticle(id));
    })

    // history.replace('/home');
  }
}

export default handleActions(
  {
    [GET_ARTICLE]: (state, action) =>
      produce(state, (draft) => {
        // console.log(action.payload.list);
        draft.list.push({...action.payload.list});
        draft.is_loading = false
        // console.log(state.list);
      }),

    [ADD_ARTICLE]: (state, action) => 
      produce(state, (draft) => {
        draft.list.unshift(action.payload.article);
      }),

    [EDIT_ARTICLE]: (state, action) => 
      produce(state, (draft) => {
        const idx = draft.list.findIndex(a => 
          a.id === action.payload.id
        );
        console.log(idx);
        console.log({...draft.list[idx], ...action.payload.article});
        draft.list[idx] = {...draft.list[idx], ...action.payload.article};
      }),

    [DELETE_ARTICLE]: (state, action) => 
      produce(state, (draft) => {
        let deleted_list = draft.list.filter(
          (p) => p.id !== Number(action.payload.id)
        );

        draft.list = deleted_list;
      }),

    [LOADING]: (state, action) => 
      produce(state, (draft) => {
        draft.is_loading = action.payload.state;
      })
  },
  initialState
);

const actionCreators = {
  getArticleDB,
  addArticleDB,
  editArticleDB,
  deleteArticleDB,
}

export {actionCreators};