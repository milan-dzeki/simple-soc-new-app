"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[743],{3389:function(t,e,o){o.d(e,{Z:function(){return v}});var n=o(2791),s="multiphotoWthDescriptionsInput_input__5TttL",a="multiphotoWthDescriptionsInput_input__label__+qane",l="multiphotoWthDescriptionsInput_input__label_icon__LZhcY",i="multiphotoWthDescriptionsInput_input__label_text__txn8W",_="multiphotoWthDescriptionsInput_input__previews__ZMPYB",d="multiphotoWthDescriptionsInput_input__previews_title__6m4v-",r="multiphotoWthDescriptionsInput_input__previews_list__8lFba",c="multiphotoWthDescriptionsInput_input__preview__HhZSx",p="multiphotoWthDescriptionsInput_input__preview_img__7slHG",m="multiphotoWthDescriptionsInput_input__preview_desc__ImiMP",h="multiphotoWthDescriptionsInput_input__preview_desc_label__zsDTz",u=o(7998),g=o(184),x=function(t){return(0,g.jsxs)("div",{className:s,children:[(0,g.jsxs)("label",{htmlFor:"photos",className:a,children:[(0,g.jsx)("span",{className:l,children:(0,g.jsx)("svg",{stroke:"currentColor",fill:"none",strokeWidth:"2",viewBox:"0 0 24 24","aria-hidden":"true",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,g.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})})}),(0,g.jsx)("span",{className:i,children:"Add Photos"}),(0,g.jsx)("input",{type:"file",id:"photos",name:"photos",multiple:!0,accept:"image/*",onChange:t.onChange})]}),t.filePreviews.length>0&&(0,g.jsxs)("div",{className:_,children:[(0,g.jsx)("p",{className:d,children:"Photos ready to go"}),(0,g.jsx)("div",{className:r,children:t.filePreviews.map((function(e,o){return(0,g.jsxs)("div",{className:c,children:[(0,g.jsx)(u.Z,{size:"btn__small",position:"btn__absolute",onClick:function(){return t.onRemoveSinglePhotoForUpload(o)}}),(0,g.jsx)("div",{className:p,children:(0,g.jsx)("img",{src:e,alt:"photoPreview"})}),(0,g.jsxs)("div",{className:m,children:[(0,g.jsxs)("label",{htmlFor:"desc_".concat(o),className:h,children:["photo ",o+1," description:"]}),(0,g.jsx)("input",{type:"text",value:t.descriptions[o]||"",onChange:function(e){return t.onInputDescriptionChanged(e,o)}})]})]},e)}))})]})]})},v=(0,n.memo)(x)},2743:function(t,e,o){o.r(e),o.d(e,{default:function(){return v}});var n=o(1413),s=o(9439),a=o(2791),l={modal:"createPostModal_modal__QnfJ8",modalAppear:"createPostModal_modalAppear__xO7Hg",modal__content:"createPostModal_modal__content__+z48z",modal__form:"createPostModal_modal__form__jL2xR",modal__tagg:"createPostModal_modal__tagg__oI8hN",modal__tagg_icon:"createPostModal_modal__tagg_icon__jD7r5",modal__tagg_text:"createPostModal_modal__tagg_text__5wlG8",modal__tagged:"createPostModal_modal__tagged__65hv+",modal__tagged_title:"createPostModal_modal__tagged_title__AwPL-",modal__tagged_list:"createPostModal_modal__tagged_list__CgBd7",modal__tagged_friend:"createPostModal_modal__tagged_friend__vXOsh",modal__tagged_friend_name:"createPostModal_modal__tagged_friend_name__ds39n",modal__btns:"createPostModal_modal__btns__1wxRG"},i=o(4164),_=o(8668),d=o(5582),r=o(8459),c=o(4818),p=o(3389),m=o(1735),h=o(4079),u=o(184),g=(0,a.lazy)((function(){return o.e(462).then(o.bind(o,3462))})),x=function(t){var e=t.onAddPostTaggs,o=(0,a.useState)(!1),x=(0,s.Z)(o,2),v=x[0],j=x[1],f=(0,a.useCallback)((function(){j(!1)}),[]),P=(0,a.useCallback)((function(t,o){e(t,o),j(!1)}),[e]);return v?(0,u.jsx)(m.Z,{show:v,taggs:t.postTaggs,onSetTaggs:P,onClose:f}):i.createPortal((0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(_.Z,{show:t.show,bcgColor:"dark",onClose:t.onClose}),(0,u.jsx)("div",{className:l.modal,children:(0,u.jsxs)("div",{className:l.modal__content,children:[(0,u.jsx)(c.Z,{text:"Create Post",onClose:t.onClose,loading:t.loading}),(0,u.jsx)("form",{className:l.modal__form,onSubmit:t.onCreatePost,children:t.loading?(0,u.jsx)(h.Z,{}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("div",{className:l.modal__inputs,children:[(0,u.jsx)(r.Z,(0,n.Z)((0,n.Z)({},t.postTextInput.postText),{},{inputGroup:"none",onInputFocus:t.onPostTextInputFocused,onInputUnfocus:t.onPostTextInputUnfocused,onInputChange:t.onPostTextInputChanged})),(0,u.jsx)(p.Z,{filePreviews:t.photoPreviews,descriptions:t.photoDescriptions,onChange:t.onUploadPostPhotos,onInputDescriptionChanged:t.onInputDescriptionChanged,onRemoveSinglePhotoForUpload:t.onRemoveSinglePhotoForUpload}),(0,u.jsxs)("div",{className:l.modal__tagg,onClick:function(){return j(!0)},children:[(0,u.jsx)("span",{className:l.modal__tagg_icon,children:(0,u.jsxs)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 16 16",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:[(0,u.jsx)("path",{d:"M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"}),(0,u.jsx)("path",{d:"M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"})]})}),(0,u.jsx)("span",{className:l.modal__tagg_text,children:"Tagg Friends"})]}),t.postTaggs.length>0&&(0,u.jsxs)("div",{className:l.modal__tagged,children:[(0,u.jsx)("p",{className:l.modal__tagged_title,children:"Tagged Friends"}),(0,u.jsx)("div",{className:l.modal__tagged_list,children:t.postTaggs.map((function(e){return(0,u.jsx)(g,{name:e.userFullName,onRemove:function(){return t.onRemoveSingleTagg(e.userId)}},e.userId)}))})]})]}),(0,u.jsxs)("div",{className:l.modal__btns,children:[(0,u.jsx)(d.Z,{btnType:"button",btnCustomType:"btn__cancel",btnText:"cancel",onClick:t.onClose}),(0,u.jsx)(d.Z,{btnType:"submit",btnCustomType:"btn__confirm",btnText:"create",disabled:0===t.postTextInput.postText.value.trim().length&&0===t.photoFiles.length&&0===t.postTaggs.length})]})]})})]})})]}),document.getElementById("modal"))},v=(0,a.memo)(x)}}]);
//# sourceMappingURL=743.d90b0895.chunk.js.map