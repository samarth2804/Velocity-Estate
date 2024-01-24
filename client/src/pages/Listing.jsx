import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import ContactForm from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);                                                             //image slider
  const [listing, setListing] = useState(null);                                             //hold listng data
  const [loading, setLoading] = useState(false);                                            //show loading during fetching data
  const [error, setError] = useState(false);                                                //error in fetching data
  const [copied, setCopied] = useState(false);                                              //to show "Link copied" message
  const [showContactForm, setShowContactForm] = useState(false);                            //to show/hide the conatact form
  const params = useParams();                                                               //to access url params
  const { currentUser } = useSelector((state) => state.user);                               //current user info

  // fetching the listing data from the db
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        //http get request to get the listing data
        const res = await fetch(`/api/listing/get/${params.listingId}`);                     //route have listingId as params
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);                                                             //when the listing id changes --> useEffect will fetch that particular listing

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <div>
          <p className="text-center my-7 text-2xl text-red-700">
            Listing Not Found!
          </p>
          <p className="text-center text-xl">
            Go to{" "}
            <Link to="/">
              {" "}
              <span className="text-blue-500 hover:underline ">Home</span>
            </Link>
          </p>
        </div>
      )}

      {/* show listings images through slider buttons */}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare                                                                  //share icon from react-icons
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {                                                    //show message for 2 seconds
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-3 gap-4">
            <p className="text-2xl font-semibold mt-7">
              {listing.name} - &#8377;{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")                          //to show price (having commas)
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-2 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  &#8377; {+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {/* if user is not the owner of listing then show the contact button */}
            {currentUser && listing.userRef !== currentUser._id && !showContactForm && (
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-7"
              >
                Contact landlord
              </button>
            )}
              {/* if user click on contact landlord button */}
              {showContactForm && <ContactForm listing={listing} />}          
          </div>
        </div>
      )}
    </main>
  );
}
