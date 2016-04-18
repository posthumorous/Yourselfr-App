import React from 'react';
import {connect} from 'react-redux';
import s from '../Subscriptions.scss';
import { Link } from 'react-router'

import { loadUser } from '../../../redux/modules/user';
import { loadFollowers } from '../../../redux/modules/followers'
import { isValidPhoto, isEmpty } from '../../Toools';
import { config } from '../../../redux/config';
import Loader from '../../Loader';
import SubscribeButton from '../../SubscribeButton';

class Followers extends React.Component {
    componentWillMount () {
      this.props.loadFollowers();
    }
    render () {
      const loadUser = this.props.loadUser.bind(this);
      const isAuthenticated = this.props.auth.authenticated;
      const myUserId = this.props.auth.user._id;

      var followersList;
      if (!isEmpty(this.props.followers)) {
        var followers = this.props.followers;
        followersList = followers.map(function (follower) {
          var photo = isValidPhoto(follower.photo);
          var linkHref = '/' + follower.alias;
          const myPageInList = follower._id === myUserId;
          return (
            <div key={follower._id} className={s.subContainer}>
                <div style={{background: `url(${config.http}/upload/background/${follower.background})`}}
                  className={s.background}>
                </div>
              <div className={s.subscription}>
                <Link to={linkHref}>
                  <img
                    src={photo}
                    className={s.photo}
                    onClick={ () => loadUser(follower.alias) }/>
                </Link>
                <div className={s.info}>
                  <div className={s.left_info}>
                    <Link
                      to={linkHref}
                      onClick={ () => loadUser(follower.alias)}
                      className={s.username}>{follower.username}
                    </Link>
                    <div className={s.alias}>
                      @{follower.alias}
                    </div>
                  </div>
                  {isAuthenticated && !myPageInList && (
                    <div className={s.SubscribeButton}>
                      <SubscribeButton
                        alias={ follower.alias }
                        isFollowing={ follower.isFollowing }
                        updateCounters={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              {!follower.background && (
                <div className={s.borderBottom}></div>
              )}
            </div>
          )
        });
      } else {
        followersList = undefined
      }

      return (
        <div className='container--right padding-0 container--subscriptions'>
          <FollowersHeader
            alias={this.props.user.alias}
            username={this.props.user.username}
          />
          {this.props.isFetching && (
            <Loader/>
          )}
          {!this.props.isFetching && (
            <div>
              {followersList && (
                followersList
              )}
              {!followersList && (
                <NoFollowers/>
              )}
            </div>
          )}
        </div>
      )
    }
}

const FollowersHeader = ({alias, username}) => {
  return (
    <div className='blockTitle'>
      <Link to={`/${alias}`} className='navLink'>{username}</Link>
      <span className='separator'></span>
      <span className='navItem'>Подписчики</span>
    </div>
  )
}

class NoFollowers extends React.Component {
  render () {
    return (
      <div className={s.noSubscriptions}>Пока нет ни одного<br/> подписчика</div>
    )
  }
}

Followers.propTypes = {
  followers: React.PropTypes.array.isRequired,
  loadFollowers: React.PropTypes.func.isRequired,
  loadUser: React.PropTypes.func.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object.isRequired,
  auth: React.PropTypes.bool.isRequired
}

function mapStateToProps (state) {
  return {
    followers: state.subscriptions.followers,
    isFetching: state.isFetching.followers,
    auth: state.auth,
    user: state.user
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadFollowers: () => dispatch(loadFollowers()),
    loadUser: (alias) => dispatch(loadUser(alias))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Followers);