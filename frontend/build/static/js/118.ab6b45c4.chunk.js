"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[118],{5118:function(e,s,t){t.r(s),t.d(s,{default:function(){return G}});var a=t(4165),o=t(5861),n=t(3433),_=t(1413),c=t(9439),r=t(2791),i=t(3576),h=t(4466),l=t(7689),d="chatsPageContainer_container__osrAc",u=t(184),m=function(e){return(0,u.jsx)("main",{className:d,children:e.children})},g={show_chats:"chatsBox_show_chats__YXjtf",show_chats__visible:"chatsBox_show_chats__visible__Jn9Wt",show_chats__text:"chatsBox_show_chats__text__s5KP3",show_chats__content:"chatsBox_show_chats__content__4+-Ps",box:"chatsBox_box__AylM7",box__show:"chatsBox_box__show__CfrXJ",box__user:"chatsBox_box__user__TfMOL",box__user_img:"chatsBox_box__user_img__ax-8m",box__user_name:"chatsBox_box__user_name__AejxQ",box__filters:"chatsBox_box__filters__D1dJ5",box__input:"chatsBox_box__input__3lXVZ",box__btns:"chatsBox_box__btns__QGoaM",box__btn:"chatsBox_box__btn__EDszT",box__btn_active:"chatsBox_box__btn_active__MgEMS",box__chats:"chatsBox_box__chats__LkRVz"},x=t(6220),p=t(1573),f=t(5746),j=t(4079),v=function(e){var s=(0,p.i)((function(e){return e.auth})).authUser,t=(0,p.i)((function(e){return e.chats})),n=t.chatsLoading,_=t.chatsErrorMsg,i=t.chats,h=(0,r.useState)(!1),l=(0,c.Z)(h,2),d=l[0],m=l[1],v=function(e){var t=i.find((function(s){return s._id===e}));if(!t)return 0;var a=t.unreadMessages.find((function(e){return e.user===s._id}));return a?a.messages.length:0},b=(0,r.useCallback)(function(){var s=(0,o.Z)((0,a.Z)().mark((function s(t,o){return(0,a.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:e.onGetSingleChat(t,o),m(!1);case 2:case"end":return s.stop()}}),s)})));return function(e,t){return s.apply(this,arguments)}}(),[]);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("div",{className:"".concat(g.show_chats," ").concat(d?g.show_chats__visible:""),children:(0,u.jsxs)("div",{className:g.show_chats__content,children:[(0,u.jsx)("button",{type:"button",className:g.show_chats__btn,onClick:function(){m((function(e){return!e}))},children:(0,u.jsx)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 1024 1024",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,u.jsx)("path",{d:"M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"})})}),(0,u.jsx)("p",{className:g.show_chats__text,children:!1===d?"see chats":"hide chats"})]})}),(0,u.jsx)("section",{className:"".concat(g.box," ").concat(d?g.box__show:""),children:s&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("article",{className:g.box__user,children:[(0,u.jsx)("div",{className:g.box__user_img,children:(0,u.jsx)("img",{src:s.profilePhotoUrl||x,alt:"user"})}),(0,u.jsx)("p",{className:g.box__user_name,children:s.fullName})]}),(0,u.jsx)("article",{className:g.box__chats,children:(0,u.jsx)("div",{className:g.box__chats_content,children:n?(0,u.jsx)(j.Z,{}):!n&&_?(0,u.jsx)("p",{className:g.cbox__chats_error}):n||_||0!==i.length?i.map((function(e){return(0,u.jsx)(f.Z,{chat:e,user:(t=e.users,t.find((function(e){return e._id!==s._id}))),isChatsPageBox:!0,onGetSingleChat:b,numOfUnseenMessages:v(e._id)},e._id);var t})):(0,u.jsx)("p",{className:g.box__chats_empty,children:"No chats"})})})]})})]})},b={chat:"selectedChat_chat__qgs4e",chat__user:"selectedChat_chat__user__Fejt5",chat__user_info:"selectedChat_chat__user_info__9MCxy",chat__user_img:"selectedChat_chat__user_img__-L1dQ",chat__user_name:"selectedChat_chat__user_name__oo5ki",chat__user_online:"selectedChat_chat__user_online__pccnK",chat__user_last_seen:"selectedChat_chat__user_last_seen__oFfn+",chat__user_btn:"selectedChat_chat__user_btn__vmFr9",chat__user_btn_icon:"selectedChat_chat__user_btn_icon__6Lj0w",chat__user_btn_text:"selectedChat_chat__user_btn_text__fLMw-",chat__messages:"selectedChat_chat__messages__HW8qF",chat__messages_content:"selectedChat_chat__messages_content__SkR92",chat__form:"selectedChat_chat__form__oKfWj",chat__form_photo:"selectedChat_chat__form_photo__6Uwwl",chat__form_photo_input:"selectedChat_chat__form_photo_input__lXBh0",chat__form_photo_icon:"selectedChat_chat__form_photo_icon__bMMsj",chat__form_photo_text:"selectedChat_chat__form_photo_text__jEDQE",chat__form_photo_uploaded:"selectedChat_chat__form_photo_uploaded__TLRwV",image:"selectedChat_image__HYFwK",chat__form_text:"selectedChat_chat__form_text__TqiHw",chat__form_emoji:"selectedChat_chat__form_emoji__viKAP",chat__form_emoji_icon:"selectedChat_chat__form_emoji_icon__cqK9D",chat__form_emoji_list:"selectedChat_chat__form_emoji_list__xmliz",emoji:"selectedChat_emoji__fN1LK",chat__form_btn:"selectedChat_chat__form_btn__LXUAL",chat__form_btn_icon:"selectedChat_chat__form_btn_icon__3ZYZo",chat__form_btn_text:"selectedChat_chat__form_btn_text__c8WMl"},w=t(2426),C=t.n(w),M=t(9348),N={message:"singleMessage_message__4+2n4",message__me:"singleMessage_message__me__3ADOX",message__content:"singleMessage_message__content__AWs89",message__text:"singleMessage_message__text__6LJVB",deliverd:"singleMessage_deliverd__igvgR",seen:"singleMessage_seen__9TT9A",message__user:"singleMessage_message__user__qhUKn",message__info:"singleMessage_message__info__XuyD-",message__user_photo:"singleMessage_message__user_photo__fJCAA",message__photo:"singleMessage_message__photo__drmn2",message__time:"singleMessage_message__time__yooQ-",message__seen:"singleMessage_message__seen__Qi-aw",message__seen_icon:"singleMessage_message__seen_icon__k5RgG"},Z=t(2186),k=function(e){return(0,u.jsx)("div",{className:"".concat(N.message," ").concat(N.message__user," ").concat(N[e.status]),children:(0,u.jsxs)("div",{className:N.message__content,children:[(0,u.jsx)("div",{className:N.message__user_photo,children:(0,u.jsx)("img",{src:e.user.profilePhotoUrl||x,alt:"user"})}),(0,u.jsxs)("div",{className:N.message__info,children:[e.photo&&(0,u.jsx)("div",{className:N.message__photo,onClick:e.onOpenPhotoSlider,children:(0,u.jsx)("img",{src:e.photo,alt:"msg_photo"})}),(0,u.jsx)("p",{className:N.message__text,children:e.text}),(0,u.jsx)("p",{className:N.message__time,children:(0,Z.X)(e.time)}),e.edited&&(0,u.jsx)("p",{className:N.message__edited,children:"edited"})]})]})})},S=function(e){return(0,u.jsx)("div",{className:"".concat(N.message," ").concat(N.message__me," ").concat(N[e.status]),children:(0,u.jsxs)("div",{className:N.message__content,children:[e.photo&&(0,u.jsx)("div",{className:N.message__photo,onClick:e.onOpenPhotoSlider,children:(0,u.jsx)("img",{src:e.photo,alt:"msg_photo"})}),(0,u.jsx)("p",{className:N.message__text,children:e.text}),"seen"===e.status&&(0,u.jsx)("div",{className:N.message__seen,children:(0,u.jsx)("div",{className:N.message__seen_icon,children:(0,u.jsxs)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 16 16",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:[(0,u.jsx)("path",{d:"M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"}),(0,u.jsx)("path",{d:"m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"})]})})}),(0,u.jsx)("p",{className:N.message__time,children:(0,Z.X)(e.time)}),e.edited&&(0,u.jsx)("p",{className:N.message__edited,children:"edited"})]})})},P=t(7998),I=t(8668),L=function(e){var s=(0,p.i)((function(e){return e.activeUsers})),t=(0,r.useState)(""),n=(0,c.Z)(t,2),_=n[0],i=n[1],h=(0,r.useState)(null),l=(0,c.Z)(h,2),d=l[0],m=l[1],g=(0,r.useState)([]),f=(0,c.Z)(g,2),v=f[0],w=f[1],N=(0,r.useState)(!1),Z=(0,c.Z)(N,2),L=Z[0],B=Z[1],A=(0,r.useRef)(null),z=(0,r.useState)(null),y=(0,c.Z)(z,2),T=y[0],E=y[1];(0,r.useEffect)((function(){if(A.current&&e.chat&&!e.isScrolling)if(e.chat.unreadMessages.length<=1){var s=A.current.scrollHeight;A.current.scrollTo({top:s})}else if(e.chat.unreadMessages.length>0){var t=A.current.firstElementChild,a=Array.from(t.children).find((function(e){return e.classList.contains("message__delivered")}));a&&E(a)}}),[A,e.chat,e.isScrolling]),(0,r.useEffect)((function(){T&&T.scrollIntoView(!1)}),[T]);var W=function(s){var t=e.photoMessages.findIndex((function(e){return e._id===s}));-1!==t&&e.onOpenPhotoSlider(t)},U=function(){var s=(0,o.Z)((0,a.Z)().mark((function s(t){return(0,a.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:e.onSendMessage(t,_,d),e.setIsScrolling(!1),i(""),m(null);case 4:case"end":return s.stop()}}),s)})));return function(e){return s.apply(this,arguments)}}(),F=(0,r.useCallback)((0,o.Z)((0,a.Z)().mark((function s(){return(0,a.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:if(!(v.length>0)){s.next=4;break}return s.next=3,e.onMarkMessagesAsSeen(v);case 3:w([]);case 4:case"end":return s.stop()}}),s)}))),[v]),O=(0,r.useCallback)((function(s){var t=s.target;t.scrollHeight-t.scrollTop-t.clientHeight<20?e.setIsScrolling(!1):e.setIsScrolling(!0)}),[]);(0,r.useEffect)((function(){var e;return e=setTimeout((function(){F()}),200),function(){clearTimeout(e)}}),[F]);var H=(0,r.useCallback)((function(){B(!1)}),[]);return e.loading?(0,u.jsx)(j.Z,{}):(0,u.jsxs)(u.Fragment,{children:[L&&(0,u.jsx)(I.Z,{show:L,bcgColor:"dark",onClose:H}),(0,u.jsx)("section",{className:b.chat,children:e.chat?e.errorMsg?(0,u.jsx)("p",{className:b.chat__error,children:e.errorMsg}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("article",{className:b.chat__user,children:[(0,u.jsxs)("div",{className:b.chat__user_info,children:[(0,u.jsx)("div",{className:b.chat__user_img,children:(0,u.jsx)("img",{src:e.chat.user.profilePhotoUrl||x,alt:"user"})}),(0,u.jsxs)("div",{className:b.chat__user_details,children:[(0,u.jsx)("p",{className:b.chat__user_name,children:e.chat.user.fullName}),function(){var t=s.map((function(e){return e.userId}));return!!e.chat&&!!t.includes(e.chat.user._id)}()?(0,u.jsx)("p",{className:b.chat__user_online,children:"online"}):(0,u.jsxs)("p",{className:b.chat__user_last_seen,children:["last seen ",C()(e.chat.user.lastTimeSeen).fromNow()]})]})]}),(0,u.jsxs)("button",{type:"button",className:b.chat__user_btn,onClick:e.onChatPhotosToggle,children:[(0,u.jsx)("span",{className:b.chat__user_btn_icon,children:(0,u.jsxs)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 24 24",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:[(0,u.jsx)("path",{fill:"none",d:"M0 0h24v24H0V0z"}),(0,u.jsx)("path",{d:"M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 15.92c-.02.03-.06.06-.08.08H3V5.08L3.08 5h17.83c.03.02.06.06.08.08v13.84zm-10-3.41L8.5 12.5 5 17h14l-4.5-6z"})]})}),(0,u.jsxs)("span",{className:b.chat__user_btn_text,children:[e.chatPhotosShow?"hide":"show"," chat photos"]})]})]}),(0,u.jsx)("article",{className:b.chat__messages,ref:A,onScroll:O,children:(0,u.jsx)("div",{className:b.chat__messages_content,children:e.chat.messages.map((function(s,t){return s.sender._id===e.chat.user._id?(0,u.jsx)(M.df,{className:"message__".concat(s.status),onChange:function(e){var t;e&&"seen"!==s.status&&(console.log("VIEW",s._id),t=s._id,w((function(e){return e.includes(t)?e:e.concat(t)})))},children:(0,u.jsx)(k,{user:s.sender,text:s.text,photo:s.photo&&s.photo.secure_url?s.photo.secure_url:null,time:s.createdAt,edited:s.edited||!1,status:s.status,onOpenPhotoSlider:s.photo?function(){return W(s._id)}:function(){}})},s._id):(0,u.jsx)(S,{text:s.text,photo:s.photo&&s.photo.secure_url?s.photo.secure_url:null,time:s.createdAt,edited:s.edited||!1,status:s.status,onOpenPhotoSlider:s.photo?function(){return W(s._id)}:function(){}},s._id)}))})}),(0,u.jsxs)("form",{className:b.chat__form,onSubmit:U,children:[(0,u.jsxs)("div",{className:b.chat__form_photo,children:[d&&(0,u.jsx)(P.Z,{size:"btn__small",position:"btn__absolute",onClick:function(){m(null)}}),(0,u.jsxs)("label",{className:b.chat__form_photo_label,htmlFor:"photo",children:[(0,u.jsx)("input",{type:"file",accept:"image/*",id:"photo",className:b.chat__form_photo_input,onChange:function(e){var s=e.target;s.files&&s.files.length>0?m(s.files[0]):m(null)}}),d?(0,u.jsx)("div",{className:b.chat__form_photo_uploaded,children:(0,u.jsx)("div",{className:b.image,children:(0,u.jsx)("img",{src:URL.createObjectURL(d),alt:"msgPhoto"})})}):(0,u.jsx)("span",{className:b.chat__form_photo_icon,children:(0,u.jsxs)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 24 24",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:[(0,u.jsx)("path",{fill:"none",d:"M0 0h24v24H0V0z"}),(0,u.jsx)("path",{d:"M21 3H3C2 3 1 4 1 5v14c0 1.1.9 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 15.92c-.02.03-.06.06-.08.08H3V5.08L3.08 5h17.83c.03.02.06.06.08.08v13.84zm-10-3.41L8.5 12.5 5 17h14l-4.5-6z"})]})}),(0,u.jsx)("span",{className:b.chat__form_photo_text,children:"upload photo"})]})]}),(0,u.jsx)("input",{className:b.chat__form_text,type:"text",placeholder:"Write message",value:_,onChange:function(e){var s=e.target;i(s.value)}}),(0,u.jsxs)("div",{className:b.chat__form_emoji,children:[L&&(0,u.jsx)("div",{className:b.chat__form_emoji_list,children:["\ud83d\ude42","\ud83d\ude00\t","\ud83d\ude03","\ud83d\ude04","\ud83d\ude01","\ud83d\ude05","\ud83d\ude06","\ud83e\udd23","\ud83d\ude02","\ud83d\ude43","\ud83d\ude09","\ud83d\ude0a","\ud83d\ude07","\ud83d\ude0e","\ud83d\ude0d","\ud83d\ude18","\ud83d\ude1d","\ud83d\ude10","\ud83d\ude2e\u200d\ud83d\udca8","\ud83d\ude1f","\ud83d\ude27","\ud83d\ude22","\ud83d\ude21","\ud83d\udc97","\ud83d\udc9b","\ud83d\udc4c","\ud83e\udd1f","\ud83d\udd95","\ud83d\udc4d","\ud83d\udc4e","\ud83d\ude4f","\ud83d\udcaa"].map((function(e,s){return(0,u.jsx)("p",{className:b.emoji,onClick:function(){return function(e){i((function(s){return"".concat(s," ").concat(e)}))}(e)},children:e},s)}))}),(0,u.jsx)("span",{className:b.chat__form_emoji_icon,onClick:function(){return B(!0)},children:(0,u.jsxs)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 16 16",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:[(0,u.jsx)("path",{d:"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"}),(0,u.jsx)("path",{d:"M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"})]})})]}),(0,u.jsxs)("button",{type:"submit",className:b.chat__form_btn,disabled:0===_.trim().length&&!d,children:[(0,u.jsx)("span",{className:b.chat__form_btn_icon,children:(0,u.jsx)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 16 16",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,u.jsx)("path",{d:"M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"})})}),(0,u.jsx)("span",{className:b.chat__form_btn_text,children:"send message"})]})]})]}):(0,u.jsx)("p",{className:b.chat__emoty,children:"No Chat selected"})})]})},B="selectedChatPhotos_photos__OnB5b",A="selectedChatPhotos_photos__empty__OcHu0",z="selectedChatPhotos_photos__show__2U+jk",y="selectedChatPhotos_photos__close__kLjIL",T="selectedChatPhotos_photos__title__5pkR3",E="selectedChatPhotos_photos__list__TeQaX",W="selectedChatPhotos_photos__list_content__KdVcx",U="selectedChatPhotos_photo__kxF8c",F=t(4164),O={slider:"chatPhotosSlider_slider__KGIGE",slider__content:"chatPhotosSlider_slider__content__T7kWP",slider__close:"chatPhotosSlider_slider__close__czmEz",slider__btn:"chatPhotosSlider_slider__btn__Cn4yr",slider__btn_left:"chatPhotosSlider_slider__btn_left__PO5KZ",slider__btn_right:"chatPhotosSlider_slider__btn_right__vabHo",slider__photo:"chatPhotosSlider_slider__photo__KATE0",slider__photo_img:"chatPhotosSlider_slider__photo_img__5WkgC",slider__photo_info:"chatPhotosSlider_slider__photo_info__yaj8F",modalAppear:"chatPhotosSlider_modalAppear__L2G1v"},H=function(e){var s=(0,p.i)((function(e){return e.auth})).authUser;return F.createPortal((0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(I.Z,{show:e.show,bcgColor:"dark",onClose:e.onClose}),(0,u.jsx)("div",{className:O.slider,children:(0,u.jsxs)("div",{className:O.slider__content,children:[(0,u.jsx)("button",{type:"button",className:O.slider__close,onClick:e.onClose,children:"close"}),(0,u.jsxs)("div",{className:O.slider__btns,children:[(0,u.jsx)("button",{type:"button",className:"".concat(O.slider__btn," ").concat(O.slider__btn_left),onClick:e.prevPhoto,children:(0,u.jsx)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 1024 1024",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,u.jsx)("path",{d:"M689 165.1L308.2 493.5c-10.9 9.4-10.9 27.5 0 37L689 858.9c14.2 12.2 35 1.2 35-18.5V183.6c0-19.7-20.8-30.7-35-18.5z"})})}),(0,u.jsx)("button",{type:"button",className:"".concat(O.slider__btn," ").concat(O.slider__btn_right),onClick:e.nextPhoto,children:(0,u.jsx)("svg",{stroke:"currentColor",fill:"currentColor",strokeWidth:"0",viewBox:"0 0 1024 1024",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:(0,u.jsx)("path",{d:"M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"})})})]}),(0,u.jsxs)("div",{className:O.slider__photo,children:[(0,u.jsx)("div",{className:O.slider__photo_img,children:(0,u.jsx)("img",{src:e.photos[e.currentPhotoIndex].photo.secure_url,alt:"msg_photo"})}),(0,u.jsxs)("div",{className:O.slider__photo_info,children:["sent by ",e.photos[e.currentPhotoIndex].sender._id===s._id?"you":e.photos[e.currentPhotoIndex].sender.fullName]})]})]})})]}),document.getElementById("modal"))},V=function(e){var s=(0,r.useState)(!1),t=(0,c.Z)(s,2),a=(t[0],t[1],(0,r.useState)(0)),o=(0,c.Z)(a,2),n=(o[0],o[1],(0,r.useState)(!1)),_=(0,c.Z)(n,2);_[0],_[1];return(0,u.jsxs)(u.Fragment,{children:[e.sliderShow&&(0,u.jsx)(H,{show:e.sliderShow,currentPhotoIndex:e.currentPhotoIndex,onClose:e.onChatPhotoSliderClose,photos:e.photoMessages,prevPhoto:e.onPrevPhoto,nextPhoto:e.onNextPhoto}),(0,u.jsxs)("section",{className:"".concat(B," ").concat(e.show?z:""),children:[(0,u.jsxs)("div",{className:T,children:[(0,u.jsx)("h4",{children:"Chat Photos"}),(0,u.jsx)("button",{className:y,onClick:e.onChatPhotosClose,children:"close"})]}),(0,u.jsx)("article",{className:E,children:(0,u.jsx)("div",{className:W,children:0===e.photoMessages.length?(0,u.jsx)("p",{className:A,children:"No Photo messages"}):e.photoMessages.map((function(e){return{id:e._id,photo:e.photo}})).map((function(s,t){return(0,u.jsx)("div",{className:U,onClick:function(){return e.onOpenPhotoSlider(t)},children:(0,u.jsx)("img",{src:s.photo.secure_url,alt:"message_photo"})},s.id)}))})})]})]})},K=t(7556),X=t(5122),G=function(){var e=(0,h.I0)(),s=(0,l.TH)(),t=(0,r.useState)(null),d=(0,c.Z)(t,2),g=d[0],x=d[1],p=(0,r.useState)(!1),f=(0,c.Z)(p,2),j=f[0],b=f[1],w=(0,r.useState)(null),C=(0,c.Z)(w,2),M=C[0],N=C[1],Z=(0,r.useState)(!1),k=(0,c.Z)(Z,2),S=k[0],P=k[1],I=(0,r.useState)(!1),B=(0,c.Z)(I,2),A=B[0],z=B[1],y=(0,r.useState)(0),T=(0,c.Z)(y,2),E=T[0],W=T[1],U=(0,r.useState)(!1),F=(0,c.Z)(U,2),O=F[0],H=F[1],G=function(e){console.log(e),W(e),z(!0)};(0,r.useEffect)((function(){e((0,K.zG)())}),[e]),(0,r.useEffect)((function(){return X.Z.on("receiveMessage",(function(s){var t=s.userId,a=s.chatId,o=s.newLastMessage,c=s.message;console.log("WTF"),e((0,K.Z0)(a,o,t)),x((function(e){return e?(0,_.Z)((0,_.Z)({},e),{},{messages:[].concat((0,n.Z)(e.messages),[c]),unreadMessages:e.unreadMessages.concat(c._id)}):e}))})),X.Z.on("seenMessages",(function(s){var t=s.userId,a=s.chatId,o=s.newUnreadMsgsList,n=s.hasLastMsg;console.log("SEEN",t,a,o,n),e((0,K.JQ)(t,a,o,n)),x((function(e){return e?(0,_.Z)((0,_.Z)({},e),{},{unreadMessages:o,messages:e.messages.map((function(e){return e.sender===t||o.includes(e._id)?(0,_.Z)({},e):(0,_.Z)((0,_.Z)({},e),{},{status:"seen"})}))}):e}))})),function(){X.Z.off("receiveMessage"),X.Z.off("seenMessages")}}),[e]);var R=(0,r.useCallback)((function(){P(!1)}),[]),D=function(){var e=(0,o.Z)((0,a.Z)().mark((function e(s,t){var o,n,_;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return H(!1),o=localStorage.getItem("socNetAppToken"),b(!0),e.prev=3,e.next=6,i.Z.get("/".concat(s,"/").concat(t),{headers:{Authorization:"Bearer ".concat(o)}});case 6:n=e.sent,_=n.data,console.log(_),x({chatId:s,messages:_.messages,photoMessages:_.messages.filter((function(e){return e.photo&&e.photo.secure_url})),user:_.user,unreadMessages:_.unreadMessages}),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(3),N(e.t0.response.data.message);case 15:b(!1);case 16:case"end":return e.stop()}}),e,null,[[3,12]])})));return function(s,t){return e.apply(this,arguments)}}();(0,r.useEffect)((function(){s.state&&s.state.clickedChatId&&s.state.userId&&D(s.state.clickedChatId,s.state.userId)}),[s.state]);var Q=function(){var s=(0,o.Z)((0,a.Z)().mark((function s(t,o,c){var r,h,l,d;return(0,a.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:if(t.preventDefault(),g){s.next=3;break}return s.abrupt("return");case 3:return r=localStorage.getItem("socNetAppToken"),(h=new FormData).append("chatId",g.chatId),h.append("userId",g.user._id),h.append("messageText",o),c&&h.append("messagePhoto",c),s.prev=9,s.next=12,i.Z.post("/sendMessage",h,{headers:{Authorization:"Bearer ".concat(r)}});case 12:l=s.sent,d=l.data,x((function(e){return e?(0,_.Z)((0,_.Z)({},e),{},{messages:[].concat((0,n.Z)(e.messages),[d.newMessage])}):e})),e((0,K.E$)(g.chatId,d.newLastMessage,d.newMessage.receiver._id)),X.Z.emit("sendMessage",{userId:g.user._id,chatId:g.chatId,newLastMessage:d.newLastMessage,message:d.newMessage}),s.next=22;break;case 19:s.prev=19,s.t0=s.catch(9),N(s.t0.response.data.message);case 22:case"end":return s.stop()}}),s,null,[[9,19]])})));return function(e,t,a){return s.apply(this,arguments)}}(),J=function(){var s=(0,o.Z)((0,a.Z)().mark((function s(t){var o,n,c,r;return(0,a.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:if(g){s.next=2;break}return s.abrupt("return");case 2:return o=localStorage.getItem("socNetAppToken"),n=JSON.stringify(t),s.prev=4,s.next=7,i.Z.post("/markMessagesAsSeen",{chatId:g.chatId,messageIds:n},{headers:{Authorization:"Bearer ".concat(o)}});case 7:c=s.sent,r=c.data,e((0,K.r5)(g.chatId,r.newUnreadMsgsList,r.userId,r.hasLastMsg)),x((function(e){if(!e)return e;var s=e.messages.map((function(e){return"seen"!==e.status&&t.includes(e._id)&&(e.status="seen"),e}));return(0,_.Z)((0,_.Z)({},e),{},{messages:s,unreadMessages:e.unreadMessages.filter((function(e){return!t.includes(e)}))})})),X.Z.emit("userSeenMessages",{userId:g.user._id,chatId:g.chatId,newUnreadMsgsList:r.newUnreadMsgsList,hasLastMsg:r.hasLastMsg}),s.next=17;break;case 14:return s.prev=14,s.t0=s.catch(4),s.abrupt("return");case 17:case"end":return s.stop()}}),s,null,[[4,14]])})));return function(e){return s.apply(this,arguments)}}();return(0,u.jsxs)(m,{children:[(0,u.jsx)(v,{onGetSingleChat:D}),g&&(0,u.jsx)(L,{loading:j,errorMsg:M,chat:g,photoMessages:g.photoMessages,onSendMessage:Q,onMarkMessagesAsSeen:J,chatPhotosShow:S,onChatPhotosToggle:function(){P((function(e){return!e}))},onOpenPhotoSlider:G,isScrolling:O,setIsScrolling:H}),g&&(0,u.jsx)(V,{show:S,photoMessages:g.photoMessages,currentPhotoIndex:E,sliderShow:A,onPrevPhoto:function(){g&&g.photoMessages.length>0&&W((function(e){return 0===e?g.photoMessages.length-1:e-1}))},onNextPhoto:function(){g&&g.photoMessages.length>0&&W((function(e){return e===g.photoMessages.length-1?0:e+1}))},onOpenPhotoSlider:G,onChatPhotoSliderClose:function(){z(!1)},onChatPhotosClose:R})]})}}}]);
//# sourceMappingURL=118.ab6b45c4.chunk.js.map