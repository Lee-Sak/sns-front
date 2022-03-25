import { dateToString } from "../functions/check_token";

const initialState = {
  loadPostLoading: false,
  loadPostError: null,
  loadPostDone: false,
  addPostStatus: false,
  updatePostStatus: false,
  detailPostStatus: false,
  data: [],
  files: [],
  imgSrc: [],
  content: "",
  imgs: [],
  postId: "",
  imgId: [],
  sentence: "",
};

const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
const LOAD_POST_ERROR = "LOAD_POST_ERROR";
const ADD_POST_FORM = "ADD_POST_FORM";
const DELETE_POST_FORM = "DELETE_POST_FORM";
const addPostAction = (data) => {
  return {
    type: ADD_POST,
    data,
  };
};

const post = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_POST_REQUEST:
      return {
        ...state,
        loadPostLoading: true,
        loadPostError: null,
        loadPostDone: false,
      };

    case LOAD_POST_SUCCESS:
      return {
        ...state,
        loadPostLoading: false,
        loadPostDone: true,
        addPostStatus: false,
        data: [...action.data],
      };
    case "UPDATE_DATE":
      return {
        ...state,
        data: state.data.map((e) => {
          const value = new Date(e.createdAt);
          return {
            ...e,
            createdAt:
              value.getFullYear() +
              "-" +
              (value.getMonth() + 1) +
              "-" +
              value.getDate() +
              " " +
              value.getHours() +
              ":" +
              value.getMinutes() +
              ":" +
              value.getSeconds(),
          };
        }),
      };
    case LOAD_POST_ERROR:
      return {
        ...state,
        loadPostLoading: false,
        loadPostError: true,
        loadPostDone: false,
      };
    case "SET_CONTENT":
      return {
        ...state,
        content: action.data,
      };
    case "UPDATE_LIKE":
      return {
        ...state,
        data: state.data.map((e) => {
          if (e.id === action.data) {
            return {
              ...e,
              like: e.like + 1,
            };
          } else {
            return e;
          }
        }),
      };

    case "DELETE_IMG":
      return {
        ...state,
        imgSrc: state.imgSrc.filter((e, i) => i !== action.data),
        files: state.files.filter((e, i) => i !== action.data),
        imgId: state.imgId.filter((e, i) => i !== action.data),
      };
    case "CREATE_POST_SUCCESS":
      return {
        ...state,
        selectContent: "",
        selectImg: "",
        addPostStatus: false,
        data: [action.data, ...state.data],
      };

    case "UPDATE_POST_SUCCESS":
      return {
        ...state,
        selectContent: "",
        selectImg: "",
        addPostStatus: false,
        data: [
          action.data.post,
          ...state.data.filter((e, i) => e.id !== action.data.id),
        ],
      };
    case "SET_SENTENCE":
      return {
        ...state,
        sentence: action.data,
      };
    case ADD_POST_FORM:
      return {
        ...state,
        imgSrc: [],
        content: "",
        sentence: "",
        files: [],
        updatePostStatus: false,
        addPostStatus: true,
      };
    case DELETE_POST_FORM:
      return {
        ...state,
        addPostStatus: false,
      };
    case "UPDATE_POST_FORM":
      return {
        ...state,
        updatePostStatus: true,
        addPostStatus: true,
        files: [],
        content: action.data.content,
        imgSrc: [...action.data.image],
        postId: action.data.postId,
        imgId: action.data.ids,
        sentence: action.data.sentence,
      };

    case "ADD_FILES":
      return {
        ...state,
        files: [action.data, ...state.files],
      };
    case "ADD_IMAGE_SOURCE":
      return {
        ...state,
        imgSrc: [action.data, ...state.imgSrc],
      };

    case "DELETE_POST":
      return {
        ...state,
        data: state.data.filter((post) => post.id !== action.data),
      };
    default:
      return state;
  }
};

export { addPostAction, post };
