# AWS S3 Setup Instructions

## 1. Create AWS S3 Bucket
1. Login to AWS Console
2. Go to S3 service
3. Create a new bucket with a unique name
4. Enable public read access for the bucket
5. Configure CORS policy:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## 2. Create IAM User
1. Go to IAM service in AWS Console
2. Create a new user with programmatic access
3. Attach the following policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## 3. Update Environment Variables
Update your `.env` file with the following values:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

## 4. Migration Note
- New images will be stored in S3
- Existing base64 images in database will continue to work
- Consider migrating existing images to S3 if needed

## 5. Folder Structure in S3
- Blog images: `blogs/`
- Skill images: `skills/`