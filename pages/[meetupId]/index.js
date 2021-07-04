import Head from 'next/head'
import { MongoClient, ObjectId } from 'mongodb'
import MeetupDetail from '../../components/meetups/MeetupDetail'

const MeetupDetails = ({ meetupData }) => {
  return (
    <>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description} />
      </Head>
      <MeetupDetail
        title={meetupData.title}
        address={meetupData.address}
        image={meetupData.image}
        description={meetupData.description}
      />
    </>
  )
}
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    `mongodb+srv://alaedd:71399264@cluster0.k1bo4.mongodb.net/meetups?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

  client.close()
  return {
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId
  const client = await MongoClient.connect(
    `mongodb+srv://alaedd:71399264@cluster0.k1bo4.mongodb.net/meetups?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  })

  client.close()

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  }
}

export default MeetupDetails
