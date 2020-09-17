import * as React from "react";

function SvgFileSignatureOutline(props) {
  return (
    <svg
      viewBox="0 0 123 123"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={1.5}
      {...props}
    >
      <use
        xlinkHref="#file-signature-outline_svg___Image1"
        x={20}
        y={10}
        width={82.919}
        height={102.9}
        transform="scale(.99902)"
      />
      <defs>
        <image
          id="file-signature-outline_svg___Image1"
          width={83}
          height={103}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAABnCAYAAAB8WX67AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAIFElEQVR4nO3deawddRUH8M99VIpgodalm6UVNKaySQ1IXFARJMqqRNSECDExuFRNFLdo4otoxR3jgkHFYIhFrGBoEBCLDzUuREoVU0XrBnRTaltpaxq7+MfpC/fNm3l35r6ZO3du3zc5f8zc33Lme3/L/H7nnN+05MNTcA5Owjw8HYfkzNsL7MYa/Bh31axLJo7BbdiD/Q2R6/GkKsjoFi0sxQ71k9ON/BSHlc5KF1iEu9VPyGTlB2oeimZhvfqJKEuuLZeeYrgxQ6kmy5WlMpQTb+hS2SbI0hJ56oi52FLBQ/SL7MXFpbHVAVf34IHqlt14RVmEZaGFh2p+0F7Jf3ByObSNR0usatYUyPN3fA+7qlAoAy/DS0sqazNehL+UVN4YXCT/P/tJ8Qf0GsMFdMwj6zC7bCWHsCBn2sfwqQPKNB3H4nbMKLPQIRyVM+1qbCuz8ppxslglHVpWgUPq6bb9gjNwg+Bh0iilkD7CdsWHodfhi2VUPmhkrsH7usi3FB+ZbOWDRiZ8Dp/pIt+VeMtkKh5EMuH9+FYX+a7Bhd1WOqhkEq1sZcE8h2A5XtJNhYNM5l68Hj8vmO8w3IoTilY4yGTCf3EeHiiYbybuwMIimQadTGKhcbbYUyiCebgTT82b4WAgEzbilfhnwXzPEdbZI/IkPljIhD/jVWKPoQhOxffxhE4JDyYyif2FC8VGcRGcjet0WHo3hcx9OdPlWUrejUsKlDmKS/DZiRI0hcztOdPNzZluBd7RhR7vEQuCVDSFzEdzpns2npEz7dfw0S50uQqXpv3QFDIfyZluSJA0LWf6j+HLBXVp4Rt4ddqPw/Jt9Y8UrLRMTMfOFJ2y5Bc4C4fnKLsllpBFTR87cVqysOGcmUfyP3slWKl+62ZStmDxqIJN6ebw7boVSMEssUqaS7PIXIHf1a1EChbgSzSLzP34UN1KZOAiHN8kMuGHSrLXVIBTmkYmXIF76lYiBUc3kcw94h3v1roVSaDVRDIJP6fX4NNiR70v0FQyiY2KD+B5WFWzLmg2maP4Pc7EiViGP6qpteZdwzYBDxyQD4vnWiA2PSYbcXG1cLvsiEEisx178LcDMlnkdlYbhG7eN5gis0RMkVkipsgsEVNkloh+n83ni6XjqG1nvoh134pNB+RhEWO+WnGLY6noRzLn403Cvn1qzjzLsEHsxt+En6ghkKGfuvlMERqzTpCTl8hRzMPlYmm5CqeUql0O9AOZLbxNBDl9UDlB9y/HvfgunlZCeblQdzefLkyzl2X8/j/Ryu4UXmzrhfPVUZgjWuMZYkhIi+m5GC/QnVthVxhWj3VyDn6ZUdefxLh5ZM6ynojXijDEtPNEHsP5Xeo5kqFjUoaph8wjsTaljn+JLt/R42wCnCp2jpJl78O5XZQ3klJWKpl1jJmjfuOLE/fvE1Fj14junYU5YrLKwr1YYrytqIXv4LlFlC2COsi8ynjXkpuEU34nN5hPCMfVzSIYKgu78HX8NXF/hjB3zMqrbFEM6103f2FKuXfJNxG2hF9l+zi4KCXdNPFW0J62Xa6VfyymT8fMFn6WKPNBPDln/kNEq2zPv8rY3rUYv87Q/2HhtFoUIxnl1TpmnosXt13vF6ElW9vuPQs3i1NsTkzk34v3Ju6dgbcKoq/A/dJf9q/D8eIVq1IM603LXJ0oL813qL3lbhKTTTtauCVRzk7Zr1jrZbj+FcBIRtm1dfNjE2Xtlj7erUuku8v4SXK2cH7tpO/18g8hE2EkR1097ebnJa5vkx6X89XE9ZliMmnHZnx8gro2iRf0S40dQnqCYdW3zOTZcpdlpBsSrbE97V6PxzIO4V3i1SdNxxuU/9ozklFXLd38cGOXePtMvPkwV6y/2+t+ROwC3ZOh22aTiMbtgJGMOmvp5icZa7t+QCwbs7DReAf8+WJlc3pK+htxnDhvo1b0gsznJ65/kyPP7fh8hzSPilXQG+WPxqgUvSBzSeJ6dY48LRMHjq4QrXFFlzpVgl7sZybJvK9D+qNFaMhZKb9twdvFWr7vUDWZh4kWNIp9xvqlzxarotFJap4IdErb6L1FbM9trkTTElA1mSck6lgrrIzvFCcGJrfh0rBVnO4yGqvTt6iazOTksxB/kH+sXimMZBvLVKoqVD0BJcfLGTnr3CbMFhdoCJFU3zKTZCaxQ9i4R3fWjxCrm6XCDt4oVEnmobJPYFkrzArLFT+ZoG9RJZnHST8B8EfCkrizwrprQZVjZnLyIewv5xtAIqmWzOR4uQtvVvx8jMagl2R+U6xgBhZVkTnN+AiFL1RUV9+gqglosbEOWOuMj3y4XGwS99LfaZfwtLujisKrepDk5JPcKVqmvnDn04U5pPSotqq6+fTEdXIP84KK6s2LSR06moWqyBzxuDFrg3BVaUfScNZL7BcuOqWjqm7+oHCQOg2/Mj7K6yvihJd3K/Fo7xzYLiyb66sovMrBf5OJ7TL3y7ZSNhL94IY9MJgis0RMkVkihvS5KaBB2D8k/3GKS0zs/jyImKnzBvcotg0JJ9A8mCHOxDhYhoYh8bx5P3PzcFO+VNVrHC68RRYVyHNSS3hP/EP+jyxNYTwewsLRCejmmpVpOsbwN+jfnaxStkg563iQv4hapWR+HHQQv9VbpSzPIpLB+4p0lbJejgCERWIXum5l+1lWKfDa1BKHwu/oA8X7SXYI/9Cuvoh4jAgzSYvhPphkzwEenjkRWXkZnoVzxGppnjjBpe5TFKrEHhHxsQG/FUT+u1Om/wPIQGsud7bgPQAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
}

export default SvgFileSignatureOutline;
