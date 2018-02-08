import chai from 'chai';
import chaiDate from 'chai-datetime';

chai.config.includeStack = true;
chai.use(chaiDate);
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

global.chai = chai;