import asyncio
import os
from broker.nats import ServiceBroker
from common.actions import ActionSchema
from models.user import UserModel
import bcrypt
import jwt

JWT_TOKEN = os.getenv('JWT_TOKEN') if os.getenv('JWT_TOKEN') else '123'
NATS_URL = os.getenv('NATS_URL') if os.getenv('NATS_URL') else 'nats://localhost:4222'
NATS_TOKEN = os.getenv('NATS_TOKEN') if os.getenv('NATS_TOKEN') else '^*&*(!ƯHUKWH)'


async def register(ctx):

    payload = ctx['payload']
    hash_password = bcrypt.hashpw(
        str(payload['password']).encode(), bcrypt.gensalt(10))
    user = UserModel(username=str(
        payload['username']), password=hash_password.decode())
    user = user.save()
    return {
        '_id': str(user.id),
        'username': user.username,
    }


async def login(ctx):

    payload = ctx['payload']
    user = UserModel.objects(username=payload['username']).get()
    if user == None:
        raise Exception("User not found")

    is_valid = bcrypt.checkpw(
        str(payload['password']).encode(), str(user['password']).encode())
    if is_valid == False:
        raise Exception("Password invalid, please try again!")

    payload = {
        'id': str(user.id),
        'username': user.username,
    }
    return {
        'token': jwt.encode(payload, key=JWT_TOKEN),
    }


async def get_profile(ctx):

    payload = ctx['payload']
    user = UserModel.objects(id=payload['id']).get()
    if user == None:
        raise Exception("User not found")

    payload = {
        'id': str(user.id),
        'username': user.username,
    }
    return payload


async def verify_token(ctx):

    payload = ctx['payload']
    jwtData = jwt.decode(payload['token'], JWT_TOKEN, algorithms=['HS256'])
    user = UserModel.objects(id=jwtData['id']).get()
    if user == None:
        raise Exception("User not found")
    payload = {
        'id': str(user.id),
        'username': user.username,
    }
    return payload


async def main():
    try:

        sb = ServiceBroker(servers=NATS_URL, token=NATS_TOKEN)
        await sb.start()

        user_actions = []
        user_actions.append(ActionSchema(
            name='register', version='1', handle=register))
        user_actions.append(ActionSchema(
            name='login', version='1', handle=login))
        user_actions.append(ActionSchema(
            name='profile', version='1', handle=get_profile))
        user_actions.append(ActionSchema(
            name='verify_token', version='1', handle=verify_token))

        await sb.create_service(
            name='user',
            workers=1,
            action_schemas=user_actions,
        )

    except Exception as e:
        print(e)


loop = asyncio.get_event_loop()
try:
    asyncio.ensure_future(main())
    loop.run_forever()
except KeyboardInterrupt:
    pass
finally:
    loop.close()
