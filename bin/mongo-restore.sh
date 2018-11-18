#/bin/sh

echo "command line sample"
echo "./bin/mongo-restore.sh ./db-name.tar db-name"

TMP_DIR="/tmp/mongorestore/"
rm -rf $TMP_DIR && mkdir $TMP_DIR
if [[ $1 =~ \.tar$ ]];
then
        #FILENAME=$(echo $1 | sed 's/.*\///')
        FILENAME=$2"/"
        mkdir $TMP_DIR
        echo "Data will be extracted into :"$TMP_DIR
        tar -C $TMP_DIR -xvf $1
else
        FILENAME=$(echo $1 | sed 's/.*\///')
        cp $1 $TMP_DIR$FILENAME
fi

mongorestore --noIndexRestore --drop -v --host 127.0.0.1:27017 --db $2 "/tmp/mongorestore/$2/"
rm -rf $TMP_DIR
