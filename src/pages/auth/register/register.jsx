import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import eyeIcon from '../../../assets/general/eye.svg';
import eyeClosedIcon from '../../../assets/general/eyeclosed.svg';
import Toaster from '../../../components/Toaster/Toaster';

import { AiFillCheckSquare } from 'react-icons/ai';

import { setUser } from '../../../app/slices/generalSlices/userSlice';

import { useDispatch } from 'react-redux';

import { useRegisterMutation } from '../../../app/slices/apiSlices/authSlice';

import { useStartVerifyEmailMutation } from '../../../app/slices/apiSlices/accountSlice';

import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [toggleShowPassword, setToggleShowPassword] = useState(false);
  const [screenWidthState, setScreenWidthState] = useState(false);

  // user data state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [category, setCategory] = useState('Student');
  const [email, setEmail] = useState('');
  const [altSchoolId, setAltSchoolId] = useState('');
  const [track, setTrack] = useState('');
  const [password, setPassword] = useState('');

  const [toastText, setToastText] = useState('');
  const [toastType, setToastType] = useState('info');

  // regex pattern states
  const [charLength, setCharLength] = useState(false);
  const [lowercase, setLowercase] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [number, setNumber] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [register, { data, isLoading, isSuccess, isError, error }] =
    useRegisterMutation();

  const [
    startVerifyEmail,
    {
      data: verifyEmailData,
      isLoading: verifyIsLoading,
      isSuccess: verifyIsSuccess,
      isError: verifyIsError,
      error: verifyError,
    },
  ] = useStartVerifyEmailMutation();

  const handleStudentRegister = (e) => {
    e.preventDefault();
    if (category === 'Student') {
      register({
        firstName,
        lastName,
        email,
        password,
        track,
        category,
        altSchoolId,
      });
    } else {
      register({
        firstName,
        lastName,
        email,
        password,
        track,
        category,
      });
    }
  };

  // if startVerifyEmailSuccess is true.
  useEffect(() => {
    if (verifyIsSuccess) {
      // save requestId to localStorage
      localStorage.setItem('requestIdForEmail', verifyEmailData.data.requestId);
    }
  }, [verifyIsSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setToastText(data?.message);
      setToastType('success');
      dispatch(setUser(data?.data));
      startVerifyEmail();
      setTimeout(() => navigate('/account/verifyemail'), 2000);
    } else if (isError) {
      setToastText(error?.data?.message);
      setToastType('error');
      setTimeout(() => setToastText(''), 3000);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    const media = window.innerWidth;
    if (media < 600) {
      setScreenWidthState(true);
    }
  }, []);

  const passwordPattern = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}'
  );

  useEffect(() => {
    const eightormore = /.{8,}/;
    const oneLowercaseLetter = /(?=.*[a-z])/;
    const oneUppercaseLetter = /(?=.*[A-Z])/;
    const oneNumber = /(?=.*[0-9])/;
    const oneSpecialCharacter = /(?=.*[!@#$%^&*])/;

    if (eightormore.test(password)) {
      setCharLength(true);
    } else {
      setCharLength(false);
    }

    if (oneLowercaseLetter.test(password)) {
      setLowercase(true);
    } else {
      setLowercase(false);
    }

    if (oneUppercaseLetter.test(password)) {
      setUppercase(true);
    } else {
      setUppercase(false);
    }

    if (oneNumber.test(password)) {
      setNumber(true);
    } else {
      setNumber(false);
    }

    if (oneSpecialCharacter.test(password)) {
      setSpecialChar(true);
    } else {
      setSpecialChar(false);
    }

    if (password === '') {
      setCharLength(false);
      setLowercase(false);
      setUppercase(false);
      setNumber(false);
      setSpecialChar(false);
    }
  }, [password]);

  return (
    <div className="mt-12 flex flex-col justify-center gap-8">
      <h2 className="mb-4 text-center text-[2rem] font-semibold sm:text-[1.5rem]">
        Create Account
      </h2>
      <form
        action=""
        className="sm:grid-row-none grid grid-cols-2 gap-4  sm:grid-cols-none"
        onSubmit={handleStudentRegister}
      >
        <div className="form-group sm:col-span-2">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Seun"
            onChange={(e) => setFirstName(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group sm:col-span-2">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Ogunlana"
            onChange={(e) => setLastName(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group col-span-2">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
            required
          >
            <option value="Student">AltSchooler</option>
            <option value="Mentor">Mentor</option>
          </select>
        </div>
        <motion.div
          className="form-group sm:col-span-2"
          style={{
            gridColumn:
              category == 'Student' && screenWidthState
                ? '1 / span 2'
                : category == 'Student' && !screenWidthState
                ? '1 / span 1'
                : '1 / span 2',
          }}
        >
          <label htmlFor="track">Track</label>
          <select
            name="track"
            id="track"
            onChange={(e) => setTrack(e.target.value)}
            className="input"
            required
          >
            <option value="">Select Track</option>
            <option value="Backend Engineering">Backend Engineering</option>
            <option value="Cloud Engineering">Cloud Engineering</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="Data Engineering">Data Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="Frontend Engineering">Frontend Engineering</option>
            <option value="Product Design">Product Design</option>
            <option value="Product Management">Product Management</option>
            <option value="Product Marketing">Product Marketing</option>
          </select>
        </motion.div>
        <AnimatePresence>
          {category == 'Student' && (
            <motion.div
              className="form-group sm:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label htmlFor="matric">Altschool Student Number</label>
              <input
                type="text"
                name="matric"
                id="matric"
                placeholder="ALT/SOP/022/0001"
                onChange={(e) => setAltSchoolId(e.target.value)}
                className="input"
                pattern="^ALT/SO[EPD]/02[2-9]/[0-9]{0,4}$"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="form-group col-span-2">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="seun@altcamp.com"
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group col-span-2">
          <label htmlFor="password">Password</label>
          <div className="password-group">
            <input
              type={toggleShowPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              required
            />
            <img
              src={toggleShowPassword ? eyeClosedIcon : eyeIcon}
              alt="showPassword"
              className="cursor-pointer"
              onClick={() => setToggleShowPassword(!toggleShowPassword)}
            />
          </div>
          {/* { */}
          <div className="flex flex-wrap gap-2 text-[11px] [&>*]:flex [&>*]:items-center [&>*]:gap-[0.2rem] [&>*]:rounded-[4px] ">
            <span
              style={{
                color: charLength ? '#0E8A1A' : '#495057',
                backgroundColor: charLength ? '#F1FEF6' : '#E9ECEF',
              }}
            >
              <AiFillCheckSquare size={16} />8 or more characters
            </span>
            <span
              style={{
                color: lowercase ? '#0E8A1A' : '#495057',
                backgroundColor: lowercase ? '#F1FEF6' : '#E9ECEF',
              }}
            >
              <AiFillCheckSquare size={16} />
              Lowercase letter
            </span>
            <span
              style={{
                color: uppercase ? '#0E8A1A' : '#495057',
                backgroundColor: uppercase ? '#F1FEF6' : '#E9ECEF',
              }}
            >
              <AiFillCheckSquare size={16} />
              Uppercase letter
            </span>
            <span
              style={{
                color: number ? '#0E8A1A' : '#495057',
                backgroundColor: number ? '#F1FEF6' : '#E9ECEF',
              }}
            >
              <AiFillCheckSquare size={16} />
              Number
            </span>
            <span
              style={{
                color: specialChar ? '#0E8A1A' : '#495057',
                backgroundColor: specialChar ? '#F1FEF6' : '#E9ECEF',
              }}
            >
              <AiFillCheckSquare size={16} />
              Special character
            </span>
          </div>
        </div>

        {/* toast */}
        <Toaster
          show={!!toastText}
          type={toastType}
          message={toastText}
          handleClose={() => setToastText('')}
        />

        <button
          type="submit"
          className="auth-btn col-span-2"
          disabled={isLoading}
        >
          {isLoading ? 'Unlocking the door...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
