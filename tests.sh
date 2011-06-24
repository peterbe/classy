#!/bin/bash

USER=`curl -X POST -d "text=I hate evil things" http://localhost:8000/train/key/angry 2>/dev/null`
curl -X POST -d "text=I love nice things" http://localhost:8000/train/key/happy/user/$USER 2>/dev/null 1>/dev/null
curl -X POST -d "text=We like nice things" http://localhost:8000/guess/user/$USER
echo
