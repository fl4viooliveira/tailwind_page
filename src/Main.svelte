<script>

  import Sidebar from "./Sidebar.svelte";

</script>

<div class="flex ">
  <div class="row-span-2 lg:block hidden w-64">
  <Sidebar />
  </div>
  <div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
  <div class="max-w-xl md:mx-auto sm:text-center items-start lg:max-w-2xl mb-20  -mt-9">
    <h1 class="font-sans text-5xl font-bold">Put anything in your macOS menu bar</h1>
  </div>
    <div class="grid gap-10 lg:grid-cols-2">
      <div class="flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg">
        <div class="max-w-xl mb-6">
          <h2 class="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
            Let us handle<br class="hidden md:block" />
            your next
            <span class="inline-block text-deep-purple-accent-400">destination</span>
          </h2>
          <p class="text-base text-gray-700 md:text-lg">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.
          </p>
        </div>
        <div class="mb-8">
          <a href="/" aria-label="" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">
            Learn more
          </a>
        </div>
        <div class="max-w-xl mb-6">
          <h2 class="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
            Let us handle<br class="hidden md:block" />
            your next
            <span class="inline-block text-deep-purple-accent-400">destination</span>
          </h2>
          <p class="text-base text-gray-700 md:text-lg">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.
          </p>
        </div>
        <div>
          <a href="/" aria-label="" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">
            Learn more
          </a>
        </div>
      </div>
      <div class="flex items-center justify-center -mx-4 lg:pl-8">
        <div class="flex flex-col items-end px-3">
          <img
            class="object-cover mb-6 rounded shadow-lg h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56"
            src="./img/xbar-menu-preview.png?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
            alt=""
          />
          <img class="object-cover w-20 h-20 rounded shadow-lg sm:h-32 xl:h-40 sm:w-32 xl:w-40" 
          src="./img/xbar-website-preview.jpg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260" alt="" />
        </div>
        <div class="px-3">
          <img class="object-cover w-40 h-40 rounded shadow-lg sm:h-64 xl:h-80 sm:w-64 xl:w-80" 
          src="./img/xbar-menu-preview.png?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;w=500" alt="" />
        </div>
      </div>
    </div>
<div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    <div class="grid max-w-md gap-10 row-gap-5 lg:max-w-screen-lg sm:row-gap-10 lg:grid-cols-3 xl:max-w-screen-lg sm:mx-auto">
      <div class="flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow">
        <div class="text-center">
          <div class="text-lg font-semibold">Start</div>
          <div class="flex items-center justify-center mt-2">
            <div class="mr-1 text-5xl font-bold">Free</div>
          </div>
          <div class="mt-2 space-y-3">
            <div class="text-gray-700">10 deploys per day</div>
            <div class="text-gray-700">10 GB of storage</div>
            <div class="text-gray-700">20 domains</div>
          </div>
        </div>
        <div>
          <a href="/"
             class="inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium 
             tracking-wide text-white transition duration-200 bg-gray-400 rounded shadow-md 
             hover:bg-gray-900 focus:shadow-outline focus:outline-none">
            Start for free
          </a>
          <p class="max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto">
            Sed ut unde omnis iste natus accusantium doloremque.
          </p>
        </div>
      </div>
      <div class="relative flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow border-purple-400">
        <div class="absolute inset-x-0 top-0 flex justify-center -mt-3">
          <div class="inline-block px-3 py-1 text-xs font-medium tracking-wider text-white uppercase rounded bg-purple-400">
            Most Popular
          </div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold">Pro</div>
          <div class="flex items-center justify-center mt-2">
            <div class="mr-1 text-5xl font-bold">$38</div>
            <div class="text-gray-700">/ mo</div>
          </div>
          <div class="mt-2 space-y-3">
            <div class="text-gray-700">200 deploys per day</div>
            <div class="text-gray-700">80 GB of storage</div>
            <div class="text-gray-700">Global CDN</div>
          </div>
        </div>
        <div>
          <a
            href="/"
            class="inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium 
            tracking-wide text-white transition duration-200 rounded shadow-md bg-purple-400 
            hover:bg-purple-700 focus:shadow-outline focus:outline-none">
            Buy Pro
          </a>
          <p class="max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto">
            Sed ut unde omnis iste natus accusantium doloremque.
          </p>
        </div>
      </div>
      <div class="flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow">
        <div class="text-center">
          <div class="text-lg font-semibold">Business</div>
          <div class="flex items-center justify-center mt-2">
            <div class="mr-1 text-5xl font-bold">$78</div>
            <div class="text-gray-700">/ mo</div>
          </div>
          <div class="mt-2 space-y-3">
            <div class="text-gray-700">500 GB of storage</div>
            <div class="text-gray-700">Unlimited domains</div>
            <div class="text-gray-700">24/7 Support</div>
          </div>
        </div>
        <div>
          <a
            href="/"
            class="inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium 
            tracking-wide text-white transition duration-200 bg-gray-400 rounded shadow-md 
            hover:bg-gray-900 focus:shadow-outline focus:outline-none">
            Buy Business
          </a>
          <p class="max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto">
            Sed ut unde omnis iste natus accusantium doloremque.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
