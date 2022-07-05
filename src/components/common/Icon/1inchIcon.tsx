import { CustomIconProps } from 'components/common/Icon/IconSVG'
import React from 'react'

export default function OneInchIcon({ size, color }: CustomIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 770 770" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M604.812 134.847C582.297 120.237 566.263 113.909 566.263 113.909C566.263 113.909 576.79 114.33 591.866 115.422C597.657 115.841 604.12 116.359 610.914 116.99C616.33 117.493 621.956 118.068 627.622 118.722C617.653 110.882 607.755 103.828 597.956 97.4924C538.576 59.1025 482.797 47.1358 436.325 47.1358C395.314 47.1358 361.576 56.4096 339.01 65.0597C320.826 72.0306 309.897 78.5963 308.264 79.5771L308.192 79.6201L331.653 42.3233L333.408 24.0741C339.739 24.6829 345.303 28.5296 348.108 34.2381C349.297 36.658 349.918 39.2657 349.981 41.8774C372.776 34.8162 402.198 28.8024 436.325 28.8024C494.442 28.8024 565.237 46.3442 638.954 104.31C645.403 109.381 647.698 118.117 644.575 125.702C642.943 129.666 640.038 132.811 636.475 134.776C649.751 144.942 663.998 157.388 678.009 172.372C728.793 226.68 775.779 313.7 763.174 443.532C762.456 450.934 757.338 457.168 750.218 459.314C746.961 460.296 743.579 460.333 740.421 459.532C736.308 515.031 712.112 606.789 607.952 685.014C601.708 689.704 593.178 689.923 586.701 685.561C584.077 683.794 582.024 681.432 580.642 678.745C579.594 679.724 578.526 680.706 577.438 681.691C547.819 708.5 502.744 737.798 441.858 746.263C441.021 746.38 440.178 746.438 439.333 746.438H438.731C431.162 746.438 424.371 741.786 421.636 734.728C421.185 733.564 420.86 732.374 420.656 731.176C405.632 734.164 387.96 736.211 367.747 736.211C333.731 736.211 292.581 730.425 244.376 713.522C235.163 710.292 230.098 700.408 232.856 691.043C235.614 681.677 245.228 676.116 254.721 678.395C268.37 681.67 281.974 683.302 296.161 683.302C388.427 683.302 460.703 614.435 460.703 531.995C460.703 491.36 443.468 454.088 414.444 426.578C414.364 426.681 414.284 426.785 414.204 426.889C407.578 435.45 399.593 445.801 393.94 453.236C384.791 466.074 381.583 473.173 382.307 479.601C385.426 500.514 378.984 521.081 367.098 536.137C366.945 536.33 366.788 536.52 366.628 536.708C361.924 542.195 352.983 549.992 345.018 556.937C344.654 557.255 344.292 557.57 343.932 557.884C335.912 564.88 328.062 571.74 322.359 577.443C322.21 577.592 322.059 577.738 321.905 577.882C307.699 591.141 289.161 593.039 278.114 593.039C275.056 593.039 272.302 592.808 270.441 592.651L270.339 592.643C270.313 592.641 270.288 592.639 270.262 592.637C268.437 592.483 267.746 592.438 267.286 592.438H265.481C265.179 592.438 264.949 592.444 264.781 592.451C264.439 592.666 263.827 593.083 262.84 593.857C261.495 594.913 259.797 596.356 257.439 598.432C252.927 602.668 247.524 604.522 243.91 605.426C239.718 606.474 235.313 606.875 231.192 606.875C220.488 606.875 208.215 604.477 198.129 601.975C187.753 599.401 178.309 596.361 172.755 594.401C172.561 594.332 172.368 594.26 172.176 594.185C166.89 592.117 162.934 588.624 160.235 585.742C157.397 582.712 154.936 579.259 152.833 575.883C148.629 569.133 144.886 561.114 141.788 553.469C135.809 538.715 130.819 521.77 129.944 513.461C129.364 507.946 130.708 502.714 131.709 499.443C132.86 495.68 134.461 491.753 136.129 488.038C139.412 480.725 143.725 472.571 147.438 465.549L147.596 465.25C150.228 460.274 152.537 455.903 154.317 452.246C155.2 450.433 155.858 448.987 156.313 447.881C156.628 447.113 156.756 446.724 156.785 446.638C157.792 441.884 160.927 418.586 164.13 393.495C167.283 368.795 170.283 344.193 170.875 339.158C171.372 334.933 171.299 332.881 170.872 330.931C170.41 328.816 169.221 325.496 165.602 319.551C165.568 319.494 165.533 319.436 165.499 319.379C165.486 319.357 165.473 319.336 165.461 319.314C157.447 305.691 157.044 292.298 160.417 275.912C119.486 247.481 15.4731 170.662 9.03619 165.395C8.99358 165.36 8.95113 165.325 8.90884 165.29C5.10032 162.116 1.2266 157.416 0.0512938 150.951C-0.531129 147.748 -0.318761 144.728 0.368055 142.095C0.702438 140.813 1.1337 139.68 1.59032 138.705C1.81859 138.217 2.05394 137.767 2.28826 137.355C2.40549 137.149 2.52273 136.951 2.63905 136.763C2.69723 136.669 2.75521 136.577 2.8129 136.487C2.84174 136.442 2.87051 136.398 2.8992 136.354L2.94218 136.289L2.96362 136.256C2.97432 136.24 2.98503 136.224 18.2393 146.394C18.2393 146.394 17.0362 148.198 20.6456 151.206C20.9381 151.445 21.4647 151.857 22.2064 152.425C22.3252 152.516 22.4494 152.611 22.5791 152.71C24.4384 154.13 27.4149 156.369 31.2806 159.255C36.4978 163.15 43.3345 168.226 51.2299 174.062C92.1797 204.335 161.608 255.091 181.263 267.909C175.247 289.565 175.247 299.792 181.263 310.019C189.685 323.855 190.286 331.073 189.083 341.3C187.88 351.526 177.052 439.956 174.646 450.784C173.674 455.155 168.979 464.033 163.803 473.821C156.156 488.281 147.459 504.726 148.177 511.542C149.38 522.972 165.021 571.698 178.856 577.112C189.083 580.722 214.349 588.542 231.192 588.542C237.208 588.542 242.622 587.339 245.028 584.933C255.255 575.909 258.263 574.104 265.481 574.104H267.286C268.663 574.104 270.166 574.231 271.796 574.368H271.798C273.727 574.529 275.832 574.706 278.114 574.706C287.739 574.706 300.372 572.901 309.396 564.479C315.634 558.241 324.011 550.933 331.88 544.069C340.705 536.37 348.892 529.228 352.708 524.776C361.731 513.347 366.544 497.706 364.138 482.065C362.333 467.628 370.153 454.995 379.177 442.362C390.607 427.323 411.661 400.253 411.661 400.253C413.128 401.358 414.575 402.484 416.002 403.629C419.357 406.322 422.601 409.123 425.729 412.028C458.931 442.863 479.036 485.325 479.036 531.995C479.036 613.236 417.722 680.952 335.685 697.675C322.958 700.269 309.733 701.636 296.161 701.636C280.521 701.636 265.482 699.831 250.442 696.222C266.556 701.872 281.795 706.212 296.161 709.469C310.44 712.706 323.856 714.875 336.409 716.198C347.532 717.37 357.979 717.878 367.747 717.878C393.71 717.878 415.021 714.28 431.447 709.833C458.029 702.636 471.817 693.214 471.817 693.214C471.817 693.214 468.253 697.797 461.845 704.889C456.589 710.706 449.421 718.211 440.738 726.26C440.274 726.69 439.806 727.122 439.333 727.555C439.31 727.575 439.288 727.596 439.265 727.617C439.088 727.779 438.91 727.942 438.731 728.105H439.333C450.756 726.516 461.583 724.134 471.818 721.136C524.056 705.832 560.865 674.473 582.664 650.673C598.655 633.214 606.568 619.823 606.568 619.823C606.568 619.823 605.174 629.78 602.959 642.131C601.979 647.594 600.839 653.525 599.587 659.271C598.75 663.114 597.864 666.873 596.942 670.354C605.07 664.251 612.682 658.064 619.811 651.82C707.93 574.635 722.173 488.74 722.803 443.688C722.832 441.62 722.832 439.638 722.809 437.747C722.809 437.738 722.809 437.729 722.809 437.72C722.809 437.719 722.809 437.718 722.809 437.716C722.809 437.715 722.809 437.714 722.809 437.712C722.809 437.709 722.809 437.706 722.809 437.702C722.808 437.693 722.808 437.683 722.808 437.674C722.808 437.673 722.808 437.672 722.808 437.671C722.808 437.669 722.808 437.667 722.808 437.665C722.808 437.634 722.807 437.602 722.807 437.571C722.807 437.57 722.807 437.568 722.807 437.567C722.636 424.229 721.331 415.445 720.955 412.913L720.907 412.59C720.888 412.458 720.873 412.356 720.864 412.284C720.911 412.354 720.979 412.449 721.066 412.567C721.13 412.653 721.205 412.752 721.29 412.863C722.331 414.222 724.892 417.367 728.072 421.241C729.901 423.469 731.935 425.937 734.001 428.446L734.003 428.448L734.005 428.451L734.006 428.452L734.028 428.479C736.438 431.405 738.892 434.384 741.117 437.097C742.497 438.779 743.788 440.359 744.927 441.761C745.706 433.736 746.247 425.888 746.565 418.212C746.565 418.211 746.566 418.209 746.566 418.208C746.566 418.189 746.567 418.17 746.568 418.151C746.568 418.14 746.569 418.13 746.569 418.119C746.569 418.115 746.57 418.11 746.57 418.105C746.57 418.105 746.57 418.104 746.57 418.103C746.57 418.1 746.57 418.096 746.57 418.093C746.571 418.086 746.571 418.079 746.571 418.072C746.572 418.065 746.572 418.057 746.572 418.05C746.572 418.049 746.572 418.047 746.572 418.046C746.614 417.031 746.652 416.019 746.686 415.01C752.081 254.375 659.399 170.269 604.812 134.847ZM194.278 101.624C194.709 103.075 195.158 104.565 195.622 106.083C198.285 114.789 201.459 124.397 204.724 132.558C207.784 123.375 211.365 115.12 215.344 107.698C241.121 59.6085 283.589 46.525 309.453 43.184C322.746 41.4668 331.653 42.3233 331.653 42.3233C333.408 24.0741 333.398 24.0731 333.388 24.0722L333.365 24.07L333.313 24.0652L333.184 24.0536C333.131 24.049 333.072 24.044 333.007 24.0386C332.95 24.0338 332.888 24.0288 332.821 24.0235C332.533 24.0009 332.156 23.9738 331.693 23.946C330.768 23.8903 329.498 23.8314 327.925 23.7998C324.782 23.7366 320.398 23.7815 315.09 24.1832C304.518 24.9833 290.018 27.2186 274.266 33.0126C251.844 41.2607 227.364 56.5982 208.324 84.0641C208.034 83.0101 207.77 82.041 207.535 81.1705C207.116 79.6166 206.79 78.3809 206.57 77.5414C206.46 77.1218 206.377 76.8016 206.323 76.5905L206.263 76.357L206.247 76.2949C204.672 70.1181 200.001 65.2012 193.913 63.3129C187.824 61.4243 181.191 62.8344 176.397 67.0366L188.481 80.8233C176.397 67.0366 176.39 67.043 176.382 67.0496L176.366 67.0636L176.331 67.0947L176.247 67.1692C176.185 67.2244 176.111 67.2906 176.026 67.3676C175.856 67.5217 175.641 67.7195 175.385 67.9608C174.871 68.443 174.191 69.0998 173.375 69.9278C171.745 71.582 169.56 73.9317 167.073 76.9514C162.116 82.971 155.856 91.7775 150.428 103.16C142.67 119.427 136.716 140.793 138.492 166.258C118.323 158.981 97.4295 151.517 79.4063 145.13C65.7015 140.273 53.63 136.029 44.7812 132.957C40.3631 131.422 36.7102 130.167 34.0453 129.27C32.7205 128.823 31.5813 128.446 30.69 128.16C30.6661 128.152 30.6357 128.143 30.5994 128.131C30.1183 127.975 28.5934 127.482 27.2488 127.213C26.9162 127.147 26.5819 127.089 26.2461 127.041C21.2788 126.332 16.3032 126.821 11.7809 128.876C9.58602 129.874 7.75459 131.129 6.26854 132.458C5.53379 133.116 4.89952 133.777 4.35556 134.414C4.08379 134.732 3.83476 135.045 3.60697 135.347C3.49306 135.498 3.38443 135.647 3.28086 135.794C3.22908 135.867 3.17855 135.939 3.12926 136.011L3.05625 136.118L3.02043 136.171L3.00269 136.198C2.99387 136.211 2.98506 136.224 18.2393 146.394C18.2393 146.394 19.4424 144.589 23.6534 145.19C23.8491 145.23 24.3712 145.386 25.1915 145.65C25.2135 145.657 25.2356 145.664 25.2579 145.671C27.2909 146.327 31.0828 147.615 36.233 149.397C42.4062 151.533 50.5311 154.376 59.9182 157.686C82.9246 165.797 113.513 176.707 141.531 186.851C148.79 189.479 155.877 192.055 162.614 194.519C160.224 187.097 158.617 179.984 157.654 173.197C152.875 139.492 164.003 113.817 174.197 98.1913C181.584 86.8689 188.481 80.8233 188.481 80.8233C188.481 80.8233 190.803 89.9296 194.278 101.624ZM18.8718 162.882C18.8713 162.882 18.884 162.886 18.9114 162.894C18.886 162.887 18.8723 162.882 18.8718 162.882Z"
          fill="white"
        />
        <path
          d="M335.864 509.738C334.011 512.054 327.519 517.939 321.334 523.545C319.489 525.218 317.672 526.865 316.013 528.386C313.505 530.685 310.924 532.984 308.371 535.258L308.37 535.26C303.577 539.53 298.883 543.711 294.958 547.636C292.552 550.042 287.739 551.245 280.521 551.245H262.474C266.091 546.422 272.512 539.085 279.489 531.637C283.337 528.077 287.221 524.672 290.747 521.768C296.915 516.664 303.083 513.213 308.48 510.195C318.347 504.675 325.638 500.597 325.638 490.487C326.017 469.987 312.262 466.018 302.061 465.879C305.103 465.174 308.531 464.62 311.802 464.62C300.372 461.613 285.935 464.62 279.317 471.238C274.505 475.649 273.436 487.547 272.366 499.444C271.831 505.393 271.297 511.342 270.294 516.355C267.6 530.361 259.118 538.096 246.142 549.928L246.123 549.945L246.085 549.98C244.588 551.345 243.033 552.764 241.419 554.253C241.041 554.604 240.668 554.944 240.299 555.274L200.513 546.432C200.513 546.432 226.981 532.596 231.192 516.956C234.964 503.486 225.223 462.027 222.717 451.36C222.425 450.118 222.232 449.293 222.169 448.979C222.206 449.016 222.286 449.09 222.406 449.199C224.227 450.865 235.135 460.845 240.216 476.651C249.841 450.182 262.474 424.917 266.083 422.51C269.184 420.443 305.592 401.056 315.783 395.638C311.328 407.729 307.06 419.703 303.982 428.527C293.153 431.534 282.325 437.55 274.505 449.581C278.716 446.574 291.95 444.769 301.575 443.566C309.997 442.964 335.864 456.8 342.482 482.667V483.87C343.685 493.495 340.677 502.519 335.864 509.738Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path
          d="M315.439 427.304C327.783 426.179 338.011 428.663 340.677 429.73C364.138 385.214 382.786 361.152 387.599 361.152C388.11 361.088 389.212 361.126 390.8 361.18C404.16 361.64 451.924 363.284 471.817 315.433C493.149 263.288 463.117 218.731 461.063 215.684L460.99 215.574C486.254 298.589 430.309 344.909 392.411 345.51C371.356 345.51 343.083 359.346 343.083 359.346L315.439 427.304Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path
          d="M460.99 215.574C461.009 215.584 461.041 215.599 461.084 215.62C463.684 216.881 508.626 238.684 521.583 306.343C551.475 341.229 570.217 384.799 575.286 430.932C575.286 433.94 579.497 438.151 583.708 441.76C589.122 447.174 594.536 452.589 594.536 458.003C594.536 472.44 593.333 486.878 590.927 500.714C589.862 504.973 585.026 507.819 579.757 510.92L579.249 511.219C579.044 511.34 578.84 511.461 578.635 511.582C578.321 511.768 578.007 511.955 577.692 512.143C576.875 512.688 575.964 513.264 575.038 513.85L575.035 513.852C571.875 515.852 568.533 517.967 568.067 519.362C555.82 562.785 530.177 601.572 495.907 630.953C552.478 599.119 595.134 545.601 612.748 481.953C618.592 456.879 619.59 430.612 614.989 403.862C593.333 281.143 468.208 218.582 460.99 215.574Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path
          d="M316.425 221.623C327.533 222.183 351.293 221.047 373.763 204.745C376.046 210.073 378.31 215.44 380.49 220.683C352.854 228.098 328.076 224.277 316.425 221.623Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path
          d="M399.381 213.868C414.35 206.979 429.474 196.196 443.248 179.704C429.935 175.892 416.163 173.176 402.036 171.66C397.825 178.277 393.614 184.292 389.403 189.105C391.895 195.25 395.486 204.146 399.381 213.868Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path
          d="M519.341 402.058C525.357 371.378 525.958 344.91 524.153 323.253C547.614 354.535 562.052 392.433 566.263 431.534C566.864 436.347 571.677 441.16 576.489 445.972C580.7 449.581 585.513 454.394 585.513 457.402C585.513 471.238 584.31 485.074 581.903 498.91C581.333 500.62 576.439 503.412 572.344 505.748L571.677 506.128C565.661 509.136 560.247 512.144 559.044 516.956C545.81 563.277 517.536 604.183 479.638 633.058C535.583 574.706 562.653 478.456 519.341 402.058Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M252.848 173.465C252.848 173.465 242.02 95.863 296.161 63.3787C295.97 63.4604 295.601 63.599 295.076 63.7965C284.004 67.9583 203.461 98.2344 252.848 173.465ZM369.551 102.481C411.059 86.8405 468.809 78.4186 558.442 95.2624C518.739 75.4108 477.231 65.1842 435.723 64.5827C420.083 64.5827 405.645 65.7858 392.411 68.192C345.489 76.6139 306.989 110.301 293.755 155.419C293.755 155.419 303.38 140.38 326.239 124.739L327.193 123.444C335.639 111.978 348.362 94.7061 360.528 80.2233C364.137 88.0436 368.348 97.6686 369.551 102.481ZM577.692 202.339C662.512 258.284 701.012 320.245 728.083 393.034C726.88 316.034 701.012 249.862 651.083 196.925L649.88 195.722C605.965 149.401 541.598 127.745 477.833 136.769C453.77 139.776 429.708 144.589 411.059 150.605C408.051 151.206 405.044 151.808 402.036 153.011H403.239C408.051 152.409 495.879 148.198 577.692 202.339ZM655.895 584.933C646.872 596.964 636.645 609.597 624.614 621.628C702.216 472.441 628.223 335.886 625.216 330.472C630.63 335.886 636.044 341.902 640.856 347.316C700.411 413.488 707.63 512.745 655.895 584.933ZM181.114 122.306C178.83 131.02 158.55 208.423 226.981 210.762C186.075 186.098 181.263 122.333 181.263 121.731L181.229 121.862L181.19 122.015L181.114 122.306ZM300.372 283.551L269.09 337.09C269.09 337.09 297.965 323.856 309.395 307.012C318.419 292.575 300.372 283.551 300.372 283.551ZM279.489 531.638C283.336 528.078 287.22 524.673 290.747 521.769C296.915 516.664 303.083 513.214 308.48 510.195C318.347 504.676 325.637 500.598 325.637 490.487C326.017 469.987 312.261 466.018 302.06 465.879C302.217 465.843 302.375 465.807 302.534 465.771C296.956 467.018 292.551 468.832 292.551 468.832C292.551 468.832 309.997 465.824 316.614 478.457C323.231 491.09 317.817 498.308 306.989 505.527C301.583 509.131 289.915 520.508 279.489 531.638ZM336.465 346.113C333.691 348.491 324.388 372.284 315.782 395.638C305.591 401.056 269.184 420.443 266.083 422.511C262.473 424.917 249.84 450.183 240.215 476.651C235.135 460.845 224.227 450.866 222.406 449.199C222.286 449.09 222.206 449.016 222.169 448.979C222.231 449.293 222.425 450.118 222.717 451.361C225.223 462.027 234.964 503.486 231.192 516.956C226.981 532.597 200.512 546.433 200.512 546.433L240.299 555.274C232.459 562.285 226.765 564.48 222.169 564.48C211.942 562.675 199.911 559.668 191.489 556.66C185.473 548.84 176.45 522.972 174.044 512.144C175.342 507.816 179.443 500.062 182.986 493.363L182.987 493.362L182.988 493.36L182.99 493.358L182.992 493.352C184.371 490.745 185.665 488.299 186.676 486.277L187.679 484.356C194.286 471.704 198.163 464.28 199.309 457.402C201.715 447.175 209.536 384.011 212.544 357.543C220.364 367.769 231.192 384.613 228.786 395.441C246.231 370.777 233.598 346.715 227.583 337.09C222.169 327.465 214.95 308.215 220.965 287.761C226.981 267.308 248.637 210.761 248.637 210.761C248.637 210.761 255.856 223.394 266.083 220.988C276.309 218.582 358.723 94.6599 358.723 94.6599C358.723 94.6599 380.981 143.386 357.52 178.879C333.458 214.371 309.997 220.988 309.997 220.988C309.997 220.988 312.366 221.419 316.425 221.623C328.075 224.277 352.854 228.098 380.489 220.684C390.371 244.448 398.535 265.663 399.028 269.113C398.723 269.824 397.784 272.06 396.422 275.305L396.415 275.322L396.412 275.328L396.41 275.334L396.408 275.339C389.692 291.337 372.753 331.685 370.754 334.683C369.551 335.886 361.129 338.293 355.114 339.496C344.887 342.504 338.872 344.308 336.465 346.113ZM352.708 130.753C352.708 130.753 358.122 154.815 344.286 171.058C326.841 190.909 311.802 190.308 312.403 190.308L352.708 130.753ZM213.747 472.442L208.934 496.504C208.934 496.504 218.559 495.301 218.559 506.129C218.559 514.551 208.934 525.981 201.114 526.582C193.294 527.184 190.286 517.559 192.091 512.145C193.895 507.332 213.747 472.442 213.747 472.442ZM305.786 271.519C326.84 275.73 332.856 300.394 321.426 313.628C309.997 326.261 281.122 344.308 264.278 348.519C260.669 362.355 229.989 356.339 241.419 312.425C241.419 312.425 246.833 333.48 252.247 331.675C257.661 329.871 319.02 233.621 319.02 233.621C319.02 233.621 311.2 258.886 305.786 271.519ZM284.441 495.471C284.113 501.295 283.578 510.802 279.317 516.957C279.736 516.538 281.031 515.17 282.719 513.387L282.721 513.384C285.878 510.049 290.409 505.263 293.153 502.519C295.026 500.833 297.133 499.497 299.145 498.221C303.597 495.398 307.59 492.865 307.59 487.48C307.59 479.058 296.161 477.254 291.348 478.457C286.536 479.66 285.333 487.48 284.731 491.691C284.603 492.588 284.529 493.895 284.441 495.471ZM563.856 518.761C550.622 566.285 520.544 608.394 481.442 638.472C486.356 636.122 491.18 633.614 495.907 630.954C530.177 601.572 555.819 562.786 568.067 519.362C568.532 517.967 571.874 515.852 575.035 513.852L575.038 513.851C575.963 513.265 576.874 512.689 577.692 512.144C577.876 512.033 578.061 511.923 578.245 511.813L578.634 511.582C578.839 511.461 579.044 511.34 579.248 511.22L579.757 510.92C585.026 507.82 589.861 504.974 590.926 500.714C593.333 486.878 594.536 472.44 594.536 458.003C594.536 452.589 589.122 447.175 583.708 441.761C579.497 438.151 575.286 433.94 575.286 430.933C570.216 384.799 551.475 341.229 521.583 306.344C521.852 307.75 522.107 309.175 522.348 310.621C549.419 344.91 566.864 386.418 571.676 430.332C571.676 432.58 574.366 435.501 576.98 438.34C577.863 439.299 578.737 440.249 579.497 441.16C584.911 446.574 590.325 451.988 590.325 457.402C590.325 471.84 589.122 486.277 586.715 500.113C585.512 504.925 579.497 508.535 573.481 511.543C572.668 512.085 571.762 512.658 570.841 513.241L570.826 513.25L570.824 513.252C567.663 515.251 564.321 517.366 563.856 518.761ZM460.989 215.574L460.993 215.576C468.258 218.607 593.337 281.168 614.989 403.862C619.589 430.612 618.591 456.879 612.748 481.952C618.523 461.087 621.606 439.132 621.606 416.496C621.606 304.107 546.145 209.168 443.247 179.704C429.473 196.196 414.35 206.979 399.38 213.869C409.592 239.364 421.887 270.545 421.887 272.722C421.887 276.332 410.458 305.808 409.254 307.011C408.051 307.613 394.215 308.816 388.801 308.816C382.786 323.254 376.77 337.09 375.567 338.894C373.762 341.3 368.348 343.105 356.919 346.113C355.696 346.48 354.35 346.871 352.97 347.272C347.559 348.846 341.635 350.568 340.676 351.527C337.669 355.136 321.426 397.847 310.598 427.925C312.239 427.652 313.856 427.449 315.439 427.304L343.083 359.347C343.083 359.347 371.356 345.511 392.411 345.511C430.309 344.909 486.254 298.589 460.989 215.574ZM210.138 248.66C214.349 240.84 210.739 235.426 207.13 232.418L205.927 231.215C198.708 227.605 153.591 210.761 109.075 195.121C148.177 220.988 191.489 246.254 198.708 249.863C204.122 252.269 207.731 252.871 210.138 248.66Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="770" height="770" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}