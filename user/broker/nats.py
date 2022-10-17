import asyncio
import json
from typing import List
import nats

from common.actions import ActionSchema

# from nats.errors import ConnectionClosedError, TimeoutError, NoServersError

class ServiceBroker:
    def __init__(self, servers, token = None):
        self.servers = servers
        self.token = token

    async def start(self):
        try:
            conn = await nats.connect(**{ "servers":self.servers, "token": self.token })
            self.broker = conn
            if self.broker.is_closed:
                raise Exception('Broker is closed')
        except Exception as e:
            raise e

    async def create_service(self, name, workers=1, action_schemas: List[ActionSchema] = []):
        self._is_connected()
        for action in action_schemas:
            for i in range(workers):
                topic_name = self._prefix_topic(
                    name=name,
                    version=action.version,
                    action_name=action.name
                )
                await self.broker.subscribe(
                    subject=topic_name,
                    queue= "{ftopic}={fnum}".format(ftopic=topic_name, fnum=i),
                    cb=self._prefix_actions(action),
                )
                print("[{ftopic}]: Registered topic".format(ftopic=topic_name))

    def _prefix_actions(self, action):
        async def msg_handle(msg):
            try:
                subject = msg.subject
                reply = msg.reply
                data = msg.data.decode()
                action_name = subject.split(".")[2]
                if action_name != action.name:
                    return None

                ctx = self._context()
                ctx['payload'] = self._decode(data)
                result = await action.handle(ctx)
                await msg.respond(self._encode({"ok": True, "result": result }))
            except Exception as e:
                await msg.respond(self._encode({"ok": False, "message": str(e) }))
        return msg_handle

    def emit(self):
        ctx = self
        async def emit_handle(topic, payload):
            try:
                ctx._is_connected()
                m = await ctx.broker.request(
                    subject=topic,
                    payload=ctx._encode(payload=payload)
                )
                response = self._decode(m.data)
                if response['ok'] == False:
                    raise Exception(response['message'])
                return response
            except Exception as e:
                raise e
        return emit_handle

    def _prefix_topic(self, name, version, action_name):
        return "v{fversion}.{fname}.{faction_name}".format(
            fversion=version,
            fname=name,
            faction_name=action_name,
        )

    def _is_connected(self):
        if self.broker == None:
            raise Exception('Broker is closed')
        return True

    def _encode(self, payload):
        return json.dumps(payload).encode()
        
    def _decode(self, payload):
        return json.loads(payload)

    def _context(self):
        return {
            "broker": self.broker,
            "emit": self.emit(),
        }