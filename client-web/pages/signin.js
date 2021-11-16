import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import { Context } from '../context/AuthContext';
import SigninForm from '../components/SigninForm';

export default function Signin() {
  const { state, signin } = useContext(Context);
  
  return (
    <>
      <div className="row">
        <div className="col-6">
          <SigninForm 
            onSubmit={signin}
          />
        </div>
        <div className="col-6">
          hi
        </div>
      </div>
    </>
  )
}
