import { FC } from 'react';
import styles from '../styles/pages/appInfoPage.module.scss';
// hooks
import { useTypedSelector } from '../hooks/useTypedSelector';
// components
import AuthHeader from '../components/Headers/AuthHeader';

const AppInfo: FC = () => {
  const { token, authUser } = useTypedSelector(state => state.auth);
  return (
    <>
      {!token && !authUser && <AuthHeader />}
      <main className={styles.info}>
        <h2 className={styles.info__title}>
          App Overview
        </h2>
        <p className={styles.info__text}>
          As name suggests, this is supposed to be social network app. I named it "simple social network app", because, even though it has social network functionalities, it lacks certain features with which I didn't want to bother for the time being due to already complex stuff that I needed to put into this. 
          <br />
          <br />
          Functionalities wise, it has basic authenitcation, friend requesting systm, basic posting functionalities, photo albums, notification system, chats, blocking users, settings, searching users and logging user activities. 
        </p>
        <h2 className={styles.info__title}>
          Technologies used
        </h2>
        <p className={styles.info__text}>
          App is built using MERN stack (MongoDB, ExpressJS, ReactJS and NodeJS). Socket.io is added for some real-time data transfer. On the frontend, TypeScript is also used with React, along with Redux for global state management. On the backend, for easier database manipulation, mongoose ODM is used. For storing photos, cloudinary is used, where each photo is uploaded.
        </p>
        <h2 className={styles.info__title}>
          Functionalities in detail
        </h2>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>
            Authentication - current 
          </h3>
          <p className={styles.info__text}>
            As far as authentication goes, it has signup and login methods. As user signs up data is sent on backend where it is validated before resonse is sent. Along with backend validation, there is also one on frontend, where user cannot send data if all required input field are filled. As response, user gets his / her data and token. Token is stored in the local storage of the browser, and it is being sent for any request that requires authorization.
            <br />
            <br />
            There is also "protect" middleware on the backend which is called before any authorized request. It extracts user's data from the token and passes it on to the main controller function.
            <br />
            <br />
            Since this is SPA, after every page refresh, there is function salled "isLoggedIn", that runs to check if user is still logged in (if token exists in local storage). If it finds token, it sends it on the backend where kind of login is redone. If token is missing or is invalid, user is logged out and redirected to signup "page".
          </p>
          <h3 className={styles.info__subtitle}>
            Authentication - possible improvements 
          </h3>
          <p className={styles.info__text}>
            Possible improvements could include reset password functionalities, or email confirmation before user is created, for additional security. Also it would be useful to have ability to view application as quest.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>User and profile - current</h3>
          <p className={styles.info__text}>
            As far as user functionalities goes, on user's personal page, there is possibilities for editing personal info. Also, there is Profile model which is connected to user and which contains additional info that user can add, remove or edit. Profile photo can be removed at any time, and new one added.
          </p>
          <h3 className={styles.info__subtitle}>User and profile - possoble improvements</h3>
          <p className={styles.info__text}>
            What is missing is password editing. Also, it woule be nice if user could remove his / her date or gender info on button click. Also, it would be nice to have album of profile photos from which user can select previous photos. Now, the state of affairs is that user can always have only 1 profile photo. 
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Photo albums - current</h3>
          <p className={styles.info__text}>
            User can create photo albums with photos and descriptions for each. Also there is album name which must be unique. After creation, user can edit album name, remove single photos, add new photos, or delete album. I didn'y put editing option here beacuse it seemed redundant. 
            <br />
            <br />
            After clicking on each photo, slider opens and user can view own, or other peoples' photos. For own photos, there is ability to add / edit description. Each photo contains comment and liking section, where he can like or comment.
          </p>
          <h3 className={styles.info__subtitle}>Photo albums - possible improvements</h3>
          <p className={styles.info__text}>
            Additional functionalities may include tagging friends in the photos, or ability to make any photo as profile photo. Also, it would be nice to have separate album for photos that come from posts. So far, they are just contained withing post documents. Another option could be to create new post when user creates album, so others can see that it happened. This way, there is no notifications for user's friends about this. The only way to view friend's photos is to go on profile page.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Friend requests - current</h3>
          <p className={styles.info__text}>
            User can add others as friends. When user clicks "add friend" button, there is a list called "sent pending requests", where this invitation is stored. User can "unsend", or withdraw this request at any time. When user sends request, person who receives gets update on the list called "received pending requests".
            <br />
            <br />
            After user clicks "accept request", person gets in user's list of friends. At any moment user can "unfriend" any user.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Posts - current</h3>
          <p className={styles.info__text}>
            User can create new posts with text, photos and tagging of friends. Each post has commenting and liking section. Posts can be deleted at any time, which deletes photos from cloudinary. On home page, user can see own posts and friends' posts.
          </p>
          <h3 className={styles.info__subtitle}>Posts - possible improvements</h3>
          <p className={styles.info__text}>
            So far, there is no editing option on post. The only way is to delete post and create new one. Editing would make this easire, where user could edit text, photos, or taggs. 
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Activity Logs - current</h3>
          <p className={styles.info__text}>
            With most actions that user do, log is created with text, date and ids. E.g. when user likes a post, log contains text, id of user who created post and post id. Logs can be deleted at any time, but I don't know if this option should be there.
          </p>
          <h3 className={styles.info__subtitle}>Activity Logs - possible improvements</h3>
          <p className={styles.info__text}>
            I don't generally like how I made this page. It should be nicer and better organized concerning log's data.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Settings - current</h3>
          <p className={styles.info__text}>
            On settings page, user can decide who can interact with his / her content. Concerning posts, photos (likes and comments), friend requests, messagging etc. Usually, each setting contain permission option. E.g. for setting "who can comment my posts", options are: everyone, friends of friends, friends only and none. If user viewing someone's profile and he doesn't belonged to setting category, this user cannot see commenting section at all.
            <br /><br />
            On this page, there are possibilities for account deactivation and deletion. If user deactivates account, he / she won't be vissible on network. Reactivation requires only ordinary login. If user deletes account, he / she is removed from all lists, comments, likes, taggs etc.
            <br /><br />
            There is also block list here where user can unblock previously blocked people. If user blocks someone from friend list, this user is removed from list. Also, blocked person cannot find blocker on the network anymore.
          </p>
          <h3 className={styles.info__subtitle}>Settings - possible improvements</h3>
          <p className={styles.info__text}>
            It would be nice that each post, or photo album has individual settuing for liking / commenting / visiblity, but I haven't done this since it would be a lots of work. But in next version that I'm planning it should be there.
            <br /><br />
            I lost track of user visiblities after blocking, so it may happen that I missed something. E.g. I may have missed to hide user's comments for people that he / she blocked. So I was sloppy here. And it should be improved.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Search users - current</h3>
          <p className={styles.info__text}>
            There is page when user can be searched. There are currently 3 options here. First, as page loads, 10 newest people are displayed. Next, there is "people you may know" section. This gives us friends of friends. Functionallity here is a little reckless, since it extracts all friends of all friends. With presentational app like this, it is alright, but if this would go to production it would be a disaster and there would be need to adjust this.
            <br /><br />
            Next, there is search option where user can type and search people.
          </p>
          <h3 className={styles.info__subtitle}>Search users - possible improvements</h3>
          <p className={styles.info__text}>
            Maybe it would be nice to have more filters. E.g. search users for particular country, city, age etc.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Chat - current</h3>
          <p className={styles.info__text}>
            Chats page conatins all chats user had. On page load chats are there and none is selected. By clicking on particular chat, messaging section appears. User can send messages and photos (one photo at the time). When user sees message, his chat partner gets notified that message is seen. There is also container that has all photos from chat which, when clicked, opens slider.
            <br />
            As far as seen messages are concerned, when user opens chat, it scrolls to first unseen message. Also shen users sends message it scrolls to bottom.
          </p>
          <h3 className={styles.info__subtitle}>Chat - possible improvements</h3>
          <p className={styles.info__text}>
            Improvements should include following:
            <br />
            1. Chat should be deletable. E.g - in the model there should be "deletedFor" array. for any deleted user, chat isn't displayed. It should be figured out how to do this properly
            <br />
            2. Messages should have delete / edit functionalities definitely
            <br />
            3. There could be an option to have chat for more then 2 people
            <br />
            4. There could be friend list so user can select friend from chats page and send message. Currently there is no this opion - user now must go to friend's page and send message from there
            <br />
            5. Option to forward messages to another users could be interesting
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Notifications - current</h3>
          <p className={styles.info__text}>
            User gets notifications for every like / comment / tag and friend requests. Notifications can be deleted and marked as read or unread.
          </p>
          <h3 className={styles.info__subtitle}>Notifications - possible improvements</h3>
          <p className={styles.info__text}>
            Would be nice to add sound when notification comes or to do a little animation with notification icon. Also, maybe popup should be added at the bottom of the page, and maybe there should be page with all notifications.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>Real-time communications - current</h3>
          <p className={styles.info__text}>
            Socket.io is used to make real-time communications available. Currently, real-time transfer happens when:
            <br />
            1. User sends message
            <br />
            2. User sees the message from another user (icon is added on seen message)
            <br />
            3. User comments / likes / tag friend on post or photo (arrives as live notification)
            <br />
            4. Friend request is sent (arrives as live notification)
            <br />
            5. Friend request is accepted (arrives as live notification)
          </p>
          <h3 className={styles.info__subtitle}>Real-time communications - possible improvements</h3>
          <p className={styles.info__text}>
            Real-time transfer should be added for ariving comments and likes on pages that have posts and photos. Currently this is not set up.
          </p>
        </div>
        <div className={styles.info__box}>
          <h3 className={styles.info__subtitle}>
            Other missing features
          </h3>
          <p className={styles.info__text}>
            What is missing currently is pagination. It should be added for messages (e.g. to load only last 20, and on scroll up to keep adding more); also for users and friends and for posts. Since this is presentational application, it may not be big deal, but for production, pagination (preferably via "infinite scroll" should be a must). 
          </p>
        </div>
      </main>
    </>
  );
};

export default AppInfo;