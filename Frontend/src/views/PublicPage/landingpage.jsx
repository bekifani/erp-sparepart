import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavigationBar from '@/components/NavigationBar'
import NewHero from './Sections/NewHero'
import PremiumSection from './Sections/PremiumSections'
import HorizontalScrollCategorySection from './Sections/HorizontalScrollCategorySection'
import AboutSection from './Sections/Aboutsection'
import Counter from './Sections/Counter'
import ValueSection from './Sections/ValueSection'
import MissionAndVision from './Sections/MissionAndVission'
import ContactSection from './Sections/ContactSection'
import Footer from './Sections/Footer'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useAddPageViewQuery, useGetLandingPageQuery, useGetPageViewsQuery, useGetSectorsListQuery } from '@/stores/apiSlice'
import Loader from './Sections/Loader'
import Ads from './Sections/Ads.jsx';

const landingpage = () => {
  const {data: data, isLoading:isLoading} = useGetLandingPageQuery()
  const {data:page_views, isLoading:isAdding} = useGetPageViewsQuery()
  const {data:sectors_list, isLoading:isLoadingSectors} = useGetSectorsListQuery();

  const {add_views} = useAddPageViewQuery() 
  const [landingData, setLandingData] = useState(null)
  useEffect(()=>{
    if(data){
      setLandingData(data)
    }
  }, [data]);
  if(isLoading){ return <Loader /> }
  return (
    <div>
      <div className='w-full flex justify-center items-center'>
      <NavigationBar />
      </div>

      <div className='p-5'>
        <NewHero data={landingData?.data?.sectors	 || []}/>
      

      </div>
      <PremiumSection data={landingData?.data?.sponsors || []}/>

      <div className='block md:hidden p-3 mt-4'>
          <Ads ads={sectors_list?.data?.ads} />
        </div>
      <div className='container'>

      </div>
      <HorizontalScrollCategorySection data={landingData?.data?.sectors	 || []}/>
      <div id="about">
      <AboutSection data={{"total_companies":landingData?.data?.total_companies , "total_categories":landingData?.data?.total_categories}}/>

      </div>
      <MissionAndVision />
      <Counter data={{"page_views":page_views?.data?.views , "total_companies":landingData?.data?.total_companies , "total_categories":landingData?.data?.total_categories}}/>
      <ValueSection />
      <ContactSection  />
      <Footer/>
      <ThemeSwitcher />
    </div>
  )
}

export default landingpage