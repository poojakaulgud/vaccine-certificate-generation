var VaccineCertificate = artifacts.require("./VaccineCertificate.sol");

module.exports = function(deployer) {
  deployer.deploy(VaccineCertificate);
};