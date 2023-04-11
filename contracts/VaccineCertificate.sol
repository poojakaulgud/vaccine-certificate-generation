pragma solidity ^0.8.0;

contract VaccineCertificate {
    struct Certificate {
        string name;
        string aadhar_number;
        uint dateOfBirth;
        uint vaccineDate;
        string vaccineType;
        bool isIssued;
    }
    // address issuerAddress;

    // issuerAddress = 0x04D8E8D88AADdc59F4e2B4260706A9A15f641F11;

    mapping(string => Certificate) certificates;

    function issueCertificate(string memory _name, string memory _aadhar, uint _dateOfBirth, uint _vaccineDate, string memory _vaccineType) public {
        Certificate memory newCertificate = Certificate(_name, _aadhar, _dateOfBirth, _vaccineDate, _vaccineType, true);
        certificates[_aadhar] = newCertificate;
    }

    function getCertificate(string memory aadhar) public view returns (Certificate memory) {
        return certificates[aadhar];
    }
}