//NOTE: this file is responsible for initialize the integration 
//tests configurations
import supertest from "supertest"
import chai from "chai"
import app from "../../app"

global.app = app
global.request = supertest(app)
global.expect = chai.expect

