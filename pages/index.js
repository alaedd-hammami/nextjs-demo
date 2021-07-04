import Head from 'next/head'
import { MongoClient } from 'mongodb'
import MeetupList from '../components/meetups/MeetupList'

const HomePage = ({ meetups }) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={meetups} />
    </>
  )
}

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://alaedd:71399264@cluster0.k1bo4.mongodb.net/meetups?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find().toArray()

  client.close()

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  }
}

// export const getServerSideProps = async (context) => {
//   const req = context.req
//   const res = context.res

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   }
// }

export default HomePage
