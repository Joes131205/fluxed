import { Test, TestingModule } from '@nestjs/testing';
import { ServerApiGateawayController } from './server-api-gateaway.controller';
import { ServerApiGateawayService } from './server-api-gateaway.service';

describe('ServerApiGateawayController', () => {
  let serverApiGateawayController: ServerApiGateawayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServerApiGateawayController],
      providers: [ServerApiGateawayService],
    }).compile();

    serverApiGateawayController = app.get<ServerApiGateawayController>(ServerApiGateawayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serverApiGateawayController.getHello()).toBe('Hello World!');
    });
  });
});
