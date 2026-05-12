"use client"
import { getDoctors } from "@/services/doctor.services"
import { useQuery } from "@tanstack/react-query"

const DoctorsList = () => {

  const { data } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  })
 
  return (
    <div>
      {data?.data?.map((doctor: any) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  )
}

export default DoctorsList  