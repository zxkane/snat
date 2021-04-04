#!/bin/bash -x

attachmentId=$(aws ec2 describe-network-interfaces --region "$(/opt/aws/bin/ec2-metadata -z  | sed 's/placement: \(.*\).$/\1/')" --network-interface-ids "{{&eniId}}" --output json | jq -r '.NetworkInterfaces[].Attachment.AttachmentId')

# detach if the eni is attached
if [ "$attachmentId" != "null" ]; then
    aws ec2 detach-network-interface --region "$(/opt/aws/bin/ec2-metadata -z  | sed 's/placement: \(.*\).$/\1/')" --attachment-id "$attachmentId"
fi

# attach the ENI
for i in {1..10}; do 
    aws ec2 attach-network-interface \
      --region "$(/opt/aws/bin/ec2-metadata -z  | sed 's/placement: \(.*\).$/\1/')" \
      --instance-id "$(/opt/aws/bin/ec2-metadata -i | cut -d' ' -f2)" \
      --device-index 1 \
      --network-interface-id "{{&eniId}}"
    if [ $? -ne 0 ]; then
        sleep 5
    else
        break
    fi
done

  
# start SNAT
systemctl enable snat
systemctl start snat