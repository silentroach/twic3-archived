import chai from 'chai';
import sinon from 'sinon';

global.chai = chai;
global.chai.config.truncateThreshold = 0;

global.sinon = sinon;

global.assert = chai.assert;
