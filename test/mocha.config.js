import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

chai.use(chaiAsPromised);

global.chai = chai;
global.chai.config.truncateThreshold = 0;

global.sinon = sinon;

global.assert = chai.assert;
