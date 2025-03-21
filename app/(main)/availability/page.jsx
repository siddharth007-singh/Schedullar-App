import { getAvailiblit } from '@/actions/availiblity'
import React from 'react'
import { defaultAvailability } from './data';
import AvailiblityForm from './_components/availability-form';

const Availiblitypage = async() => {

    const availability = await getAvailiblit();
    console.log(availability); 

  return (
    <div>
        <div><AvailiblityForm initialdata={availability || defaultAvailability}/></div>
    </div>
  )
}

export default Availiblitypage  