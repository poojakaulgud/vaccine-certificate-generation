import './App.css';
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import VaccineCertificate from "./contracts/VaccineCertificate.json";
import { PDFDownloadLink, Page, Text, View, Document, Image, StyleSheet } from "@react-pdf/renderer";
import QRCode from "qrcode.react";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [certificateContract, setCertificateContract] = useState(null);
  const [name, setName] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [getAadharNumber, setGetAadharNumber] = useState("");
  const [myCertificate, setMyCertificate] = useState(null);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    image: {
      padding: 10,
      width: '25%',
  },
  });

  const MyCertificatePDF = ({name, aadharNumber, dateOfBirth, vaccinationDate, vaccineName}) => {
    const qrCodeImage = document.getElementById('myCertificate').toDataURL();
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Name: {name}</Text>
            <Text>Aadhar Number: {aadharNumber}</Text>
            <Text>Date of Birth: {dateOfBirth}</Text>
            <Text>Vaccination Date: {vaccinationDate}</Text>
            <Text>Vaccine Name: {vaccineName}</Text>
            <Image src={qrCodeImage} style={styles.image}/>
          </View>
        </Page>
      </Document>
    );
  };

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const networkId = await web3.eth.net.getId();
        const networkData = VaccineCertificate.networks[networkId];
        if (networkData) {
          const contract = new web3.eth.Contract(
            VaccineCertificate.abi,
            networkData.address
          );
          setCertificateContract(contract);
        } else {
          alert("VaccineCertificate contract not deployed to detected network.");
        }
      } else {
        alert("Please install MetaMask.");
      }
    }
    loadWeb3();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await checkIfCertificateExists();
    if (result === true) {
      alert("Certificate already exists for this aadhar number")
    } else {
      const receipt = await certificateContract.methods
        .issueCertificate(name, aadharNumber, dateOfBirth, vaccinationDate, vaccineName)
        .send({ from: account });
      console.log(receipt);
    }
  }

  async function checkIfCertificateExists() {
    const newCertificate = await certificateContract.methods.getCertificate(aadharNumber).call();
    console.log(newCertificate)
    if (newCertificate.isIssued === true) {
      return true;
    } else {
      return false;
    }
  }

  async function getMyCertificate(event) {
    event.preventDefault();
    const newCertificate = await certificateContract.methods.getCertificate(getAadharNumber).call();
    console.log(newCertificate);
    if (newCertificate.isIssued === true) {
      setMyCertificate(newCertificate);
    } else {
      setMyCertificate(null);
      alert("Certificate Not Found")
    }
  }

  return (
    <div>
      <center>
      <h1>Vaccine Certificate Issuer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:&nbsp;
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label><br></br><br></br>
        <label>
          Aadhar Number:&nbsp;
          <input
            type="text"
            value={aadharNumber}
            onChange={(event) => setAadharNumber(event.target.value)}
            required
          />
        </label><br></br><br></br>
        <label>
          Date of Birth:&nbsp;
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            required
          />
        </label><br></br><br></br>
        <label>
          Vaccine Name:&nbsp;
          <input
            type="text"
            value={vaccineName}
            onChange={(event) => setVaccineName(event.target.value)}
            required
          />
        </label><br></br><br></br>
        <label>
          Vaccination Date:&nbsp;
          <input
            type="date"
            value={vaccinationDate}
            onChange={(event) => setVaccinationDate(event.target.value)}
            required
          />
        </label><br></br><br></br>
        <button type="submit">Issue Certificate</button>
      </form>
      <h2>Get your Certificate:</h2>
      <form onSubmit={getMyCertificate}>
        <label>
          Aadhar Number:&nbsp;
          <input
            type="text"
            value={getAadharNumber}
            onChange={(event) => setGetAadharNumber(event.target.value)}
            required
          />
        </label><br></br><br></br>
        <button type="submit">Get Certificate</button>
      </form>
      {
        myCertificate != null &&
        <div>
          <p>Name: {myCertificate.name}</p>
          <p>Vaccine Name: {myCertificate.vaccineType}</p>
          <p>Vaccination Date: {myCertificate.vaccineDate}</p>
          <PDFDownloadLink
            document={<MyCertificatePDF name={myCertificate.name} aadharNumber={myCertificate.aadhar_number} dateOfBirth={myCertificate.dateOfBirth} vaccinationDate={myCertificate.vaccineDate} vaccineName={myCertificate.vaccineType} />}
            fileName="MyCertificate.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>
          <QRCode
            value={myCertificate.aadhar_number} 
            id='myCertificate'
            style={{display: 'none'}}
          />
          {pdfDownloaded && <p>PDF has been downloaded.</p>}
        </div>
      }
    </center>
    </div>
  );
}

export default App;
