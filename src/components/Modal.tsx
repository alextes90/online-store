import { Box, Button, Input, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import Image from 'mui-image';
import RSlogo from '../assets/rsschooljs.svg';
import VisaLogo from '../assets/visa.svg';
import MasterCardLogo from '../assets/mastercard.svg';
import AmericanExpressLogo from '../assets/american-express.svg';
import { useNavigate } from 'react-router';

const ModalCart = () => {
  const [customerName, setCustomerName] = useState('');
  const [isCustomerName, setIsCustomerName] = useState(false);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [isCustomerPhoneNumber, setIsCustomerPhoneNumber] = useState(false);
  const [customerAddress, setCustomerAddress] = useState('');
  const [isCustomerAddress, setIsCustomerAddress] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isCustomerEmail, setIsCustomerEmail] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [isCardNumber, setIsCardNumber] = useState(false);
  const [cardUrl, setCardUrl] = useState(RSlogo);
  const [validDate, setValidDate] = useState('');
  const [isValidDate, setIsValidDate] = useState(false);
  const [cvv, setSvv] = useState('');
  const [isCvv, setIsCvv] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [seconds, setSeconds] = useState(1);
  const navigate = useNavigate();

  function customerNameHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const tempInput = event.target.value.split(' ');
    const [firstWord, secondWord] = tempInput;
    if (!(firstWord?.length >= 3) || !(secondWord?.length >= 3)) {
      setIsCustomerName(true);
    } else setIsCustomerName(false);
    setCustomerName(event.target.value);
  }

  function customerPhoneNumberHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const tempInput = event.target.value;
    const tempInputNumber = tempInput.slice(1);
    if (tempInput[0] !== '+' || isNaN(Number(tempInputNumber)) || tempInputNumber.length < 9) {
      setIsCustomerPhoneNumber(true);
    } else setIsCustomerPhoneNumber(false);
    setCustomerPhoneNumber(event.target.value);
  }

  function customerAddressHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const tempInput = event.target.value.split(' ');
    const [firstWord, secondWord, thirdWord] = tempInput;
    if (!(firstWord?.length >= 5) || !(secondWord?.length >= 5) || !(thirdWord?.length >= 5)) {
      setIsCustomerAddress(true);
    } else setIsCustomerAddress(false);
    setCustomerAddress(event.target.value);
  }

  function customerEmailHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const specialChars = '[`!#$%^&*()_+-=[]{};\':"\\|,<>/?~]/';
    const tempInput = event.target.value;
    const secondPart = tempInput.split('@').at(-1);
    const domain = secondPart?.split('.').at(-1);
    if (
      !tempInput.includes('@') ||
      tempInput.indexOf('@') !== tempInput.lastIndexOf('@') ||
      specialChars.split('').some((specialChar) => secondPart?.includes(specialChar)) ||
      !secondPart?.includes('.') ||
      secondPart.indexOf('.') !== secondPart.lastIndexOf('.') ||
      !domain ||
      (domain && domain.length < 2)
    ) {
      setIsCustomerEmail(true);
    } else setIsCustomerEmail(false);
    setCustomerEmail(event.target.value);
  }

  function cardNumberHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const tempInput = +event.target.value.replaceAll(' ', '');
    if (!isNaN(tempInput) && !(tempInput.toString().length > 16)) {
      if (tempInput.toString().length < 16) {
        setIsCardNumber(true);
      } else setIsCardNumber(false);
      const tempOutPut = [];
      for (let i = 0; i < tempInput.toString().length; i++) {
        tempOutPut.push(tempInput.toString().split('')[i]);
        if ((i + 1) % 4 === 0 && tempInput.toString().split('')[i + 1]) {
          tempOutPut.push(' ');
        }
      }
      setCardNumber(tempInput ? tempOutPut.join('').toString() : '');
      switch (tempInput.toString()[0]) {
        case '4':
          setCardUrl(VisaLogo);
          break;
        case '5':
          setCardUrl(MasterCardLogo);
          break;
        case '3':
          setCardUrl(AmericanExpressLogo);
          break;
        default:
          setCardUrl(RSlogo);
      }
    }
  }

  function validDateHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const tempInput = +event.target.value.replaceAll('/', '');
    const tempInputString = event.target.value.replaceAll('/', '');
    const tempOutPut = [];
    if (
      !isNaN(tempInput) &&
      !(tempInputString.length > 4) &&
      +tempInputString.split('').slice(0, 2).join('') < 13 &&
      +tempInputString.split('').slice(2, 4).join('') < 32
    ) {
      if (tempInputString.length < 4) {
        setIsValidDate(true);
      } else setIsValidDate(false);
      for (let i = 0; i < tempInputString.length; i++) {
        tempOutPut.push(tempInputString.split('')[i]);
        if ((i + 1) % 2 === 0 && tempInputString.split('')[i + 1]) {
          tempOutPut.push('/');
        }
      }
      setValidDate(tempInputString ? tempOutPut.join('').toString() : '');
    }
  }

  function cvvHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const tempInput = +event.target.value;
    const tempInputString = event.target.value;
    if (!isNaN(tempInput) && !(tempInputString.length > 3)) {
      setSvv(tempInputString ? tempInputString : '');
    }
    if (tempInputString.length < 3) {
      setIsCvv(true);
    } else setIsCvv(false);
  }

  function onClickHandler() {
    const checkerArr = [customerName, customerPhoneNumber, customerAddress, customerEmail, cardNumber, validDate, cvv];
    const isSetArr = [
      setIsCustomerName,
      setIsCustomerPhoneNumber,
      setIsCustomerAddress,
      setIsCustomerEmail,
      setIsCardNumber,
      setIsValidDate,
      setIsCvv,
    ];

    let checker = true;

    checkerArr.forEach((item, index) => {
      if (item.length === 0) {
        checker = false;
        isSetArr[index](true);
      }
    });

    if (
      checker &&
      !isCustomerName &&
      !isCustomerPhoneNumber &&
      !isCustomerAddress &&
      !isCustomerEmail &&
      !isCardNumber &&
      !isValidDate &&
      !isCvv
    ) {
      setIsConfirmed(true);
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);

      setTimeout(() => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isConfirmed]);

  if (isConfirmed) {
    return <Box>You will be redirect to main page in {seconds} seconds</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      Personal details
      <Box>
        <Input error={isCustomerName} placeholder="Name" onChange={customerNameHandler} value={customerName} />
        {isCustomerName && (
          <Box component="div" sx={{ display: 'inline', color: 'red' }}>
            Error
          </Box>
        )}
      </Box>
      <Box>
        <Input
          type="tel"
          placeholder="Phone number"
          error={isCustomerPhoneNumber}
          onChange={customerPhoneNumberHandler}
          value={customerPhoneNumber}
        />
        {isCustomerPhoneNumber && (
          <Box component="div" sx={{ display: 'inline', color: 'red' }}>
            Error
          </Box>
        )}
      </Box>
      <Box>
        <Input
          placeholder="Delivery address"
          error={isCustomerAddress}
          onChange={customerAddressHandler}
          value={customerAddress}
        />
        {isCustomerAddress && (
          <Box component="div" sx={{ display: 'inline', color: 'red' }}>
            Error
          </Box>
        )}
      </Box>
      <Box>
        {' '}
        <Input
          placeholder="E-mail"
          type="email"
          error={isCustomerEmail}
          onChange={customerEmailHandler}
          value={customerEmail}
        />
        {isCustomerEmail && (
          <Box component="div" sx={{ display: 'inline', color: 'red' }}>
            Error
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <Box>Credit Card details</Box>
        <Paper sx={{ width: '20rem', height: '10rem', m: '1rem', backgroundColor: 'neutral.main' }}>
          <Box sx={{ display: 'flex' }}>
            {' '}
            <Box sx={{ marginLeft: '1rem', marginTop: '2rem' }}>
              <Image src={`${cardUrl}`} alt="card Brand" width="2rem" height="2rem" fit="fill" />{' '}
            </Box>
            <Input
              sx={{ marginLeft: '1rem', marginTop: '2rem' }}
              error={isCardNumber}
              type="tel"
              value={cardNumber}
              onChange={cardNumberHandler}
              placeholder="Card Number"
            />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', marginLeft: '1rem', marginTop: '2rem', alignItems: 'center' }}>
              <Box>Valid</Box>
              <Input
                error={isValidDate}
                value={validDate}
                onChange={validDateHandler}
                placeholder="Valid Date"
                type="tel"
                sx={{ ml: '1rem', mr: '1rem' }}
              />
            </Box>
            <Box sx={{ display: 'flex', marginLeft: '1rem', marginTop: '2rem', alignItems: 'center' }}>
              <Box>CVV</Box>
              <Input
                type="tel"
                sx={{ ml: '1rem', mr: '1rem' }}
                error={isCvv}
                value={cvv}
                onChange={cvvHandler}
                placeholder="CVV"
              />
            </Box>
          </Box>
        </Paper>
        {isCardNumber && (
          <Box component="div" sx={{ display: 'inline', color: 'red' }}>
            Invalid card number
          </Box>
        )}
        {isValidDate && (
          <Box component="div" sx={{ display: 'inline', color: 'red' }}>
            Invalid Date
          </Box>
        )}
        {isCvv && (
          <Box component="div" sx={{ display: 'inline', color: 'red' }}>
            Invalid CVV code
          </Box>
        )}
        <Button variant="contained" onClick={onClickHandler}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default ModalCart;
