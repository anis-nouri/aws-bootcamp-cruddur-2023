import './HomeFeedPage.css';
import React from "react";

import opentelemetry from '@opentelemetry/api';
import {reportSpan} from '../utilities/tracing'

import DesktopNavigation  from '../components/DesktopNavigation';
import DesktopSidebar     from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

// [TODO] Authenication
import Cookies from 'js-cookie'

export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

 
  const loadData = async () => {
    try {
    
      // Create a tracer and start the parent span
      const tracer = opentelemetry.trace.getTracer('loadData');
      const parentSpan = tracer.startSpan('loadData');
      const parentId = parentSpan._spanContext.spanId
  
      // Call the backend and record the span duration
      const fetchDataSpan = tracer.startSpan('fetchData', { parent: parentSpan });
      fetchDataSpan.setAttribute('parentSpanId', parentId);
      
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`
      const res = await fetch(backend_url, { method: "GET" });
      let resJson = await res.json();
      fetchDataSpan.end();
    

      // Process the data and record the span duration
      const processDataSpan = tracer.startSpan('processData', { parent: parentSpan });
      processDataSpan.setAttribute('parentSpanId', parentId);

      if (res.status === 200) {
        setActivities(resJson)
      } else {
        console.log(res)
      }
      processDataSpan.end();
  
      // End the parent span
      parentSpan.end();
  
      // Report the parent span
      reportSpan([parentSpan, fetchDataSpan, processDataSpan]);
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuth = async () => {
    console.log('checkAuth')
    // [TODO] Authenication
    if (Cookies.get('user.logged_in')) {
      setUser({
        display_name: Cookies.get('user.name'),
        handle: Cookies.get('user.username')
      })
    }
  };

  React.useEffect(()=>{
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth();
  }, [])

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
        <ActivityForm  
          popped={popped}
          setPopped={setPopped} 
          setActivities={setActivities} 
        />
        <ReplyForm 
          activity={replyActivity} 
          popped={poppedReply} 
          setPopped={setPoppedReply} 
          setActivities={setActivities} 
          activities={activities} 
        />
        <ActivityFeed 
          title="Home" 
          setReplyActivity={setReplyActivity} 
          setPopped={setPoppedReply} 
          activities={activities} 
        />
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}