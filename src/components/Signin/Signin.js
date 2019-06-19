import React, { Component } from 'react';


export class Signin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }

  onEmailChange=(event) => {
    this.setState({ signInEmail: event.target.value })
  }

  onPasswordChange=(event) => {
    this.setState({ signInPassword: event.target.value })
  }

  setAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  }

  onSubmitSignIn = (e) => {
   console.log(this.state);
   e.preventDefault();
   fetch('http://localhost:3000/signin', {
     method: 'post',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({
       email: this.state.signInEmail,
       password: this.state.signInPassword
     })
   })
   .then(response => response.json())
   .then(data => {
     if(data.userId && data.success === 'true') {
      this.setAuthTokenInSession(data.token)
      fetch(`http://localhost:3000/profile/${data.userId}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : data.token 
          }
        })
        .then(resp => resp.json())
        .then(user => {
          if(user && user.email) {
            this.props.loadUser(user)
            this.props.onRouteChange('home');
          }
        })
        .catch(err => console.log(err));
     }
   })
   .catch(err => console.log(err));
  }


  render() {
    
    return (
      <div>
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l shadow-5 mw6 center">
      <main className="pa4 black-80">
        <form className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f2 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
              type="email" 
              name="email-address"  
              id="email-address" 
              onChange={this.onEmailChange}  
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
              type="password" 
              name="password"  
              id="password" 
              onChange={this.onPasswordChange}  
              />
            </div>
          </fieldset>
          <div className="">
            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
            type="submit" 
            value="Sign in" 
            onClick={this.onSubmitSignIn}  
            />
          </div>
          <div className="lh-copy mt3">
            <p onClick={ () => this.props.onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
          </div>
        </form>
      </main>
</article>
      </div>
    )
  }
}

export default Signin

